// Vercel Serverless Function
// ✔ 기능: 주식 가격 업데이트 (Yahoo → Supabase)
// ✔ 개선: 병렬 처리 + chunk로 속도 최적화 (약 5~10배 빨라짐)

import { createClient } from "@supabase/supabase-js";

// 🔥 Supabase 연결 (서버용 env 사용)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// 🔥 Yahoo Finance에서 주식 가격 가져오기
async function fetchPrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;

    // 🔥 등락률 계산 (%)
    const changeRate =
      prevClose > 0
        ? Math.round(((price - prevClose) / prevClose) * 10000) / 100
        : 0;

    return { price, changeRate };
  } catch {
    return null;
  }
}

// 🔥 딜레이 함수 (rate limit 방지용)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  // GET 요청만 허용
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1️⃣ Supabase에서 종목 목록 가져오기
  const { data: stocks, error } = await supabase
    .from("stocks")
    .select("id, symbol");

  if (error || !stocks) {
    return res.status(500).json({ error: "stocks 조회 실패" });
  }

  // 🔥 핵심: chunk 단위 병렬 처리
  // → 너무 많이 동시에 요청하면 API 막힘
  // → 그래서 10개씩 끊어서 처리
  const chunkSize = 10;

  const chunks = [];
  for (let i = 0; i < stocks.length; i += chunkSize) {
    chunks.push(stocks.slice(i, i + chunkSize));
  }

  let results = [];

  // 2️⃣ chunk 단위로 반복
  for (const chunk of chunks) {
    // 🔥 chunk 안에서는 병렬 처리 (속도 핵심)
    const chunkResults = await Promise.all(
      chunk.map(async (stock) => {
        const data = await fetchPrice(stock.symbol);

        // ❌ 가격 못 가져오면 실패 처리
        if (!data) {
          return { symbol: stock.symbol, status: "failed" };
        }

        // 3️⃣ Supabase 업데이트
        const { error: updateError } = await supabase
          .from("stocks")
          .update({
            price: data.price,
            change_rate: data.changeRate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", stock.id);

        return {
          symbol: stock.symbol,
          status: updateError ? "db_error" : "ok",
          price: data.price,
          changeRate: data.changeRate,
        };
      }),
    );

    // 결과 누적
    results = [...results, ...chunkResults];

    // 🔥 chunk 사이 쉬는 시간 (API 차단 방지)
    await sleep(300);
  }

  // 4️⃣ 결과 정리
  const succeeded = results.filter((r) => r.status === "ok").length;
  const failed = results.filter((r) => r.status !== "ok").length;

  return res.status(200).json({
    message: `✅ ${succeeded}개 성공, ❌ ${failed}개 실패`,
    results,
  });
}
