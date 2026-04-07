// Vercel Serverless Function
// 용도 1: 브라우저에서 직접 호출 → 즉시 가격 채우기
// 용도 2: vercel.json Cron 등록 → 매일 자동 실행

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Yahoo Finance에서 시세 가져오기
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
    const changeRate =
      prevClose > 0
        ? Math.round(((price - prevClose) / prevClose) * 10000) / 100
        : 0;

    return { price, changeRate };
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  // GET 요청만 허용
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 종목 목록 조회
  const { data: stocks, error } = await supabase
    .from("stocks")
    .select("id, symbol");

  if (error || !stocks) {
    return res.status(500).json({ error: "stocks 조회 실패" });
  }

  const results = [];

  for (const stock of stocks) {
    await sleep(300); // Yahoo Finance 요청 제한 방지

    const data = await fetchPrice(stock.symbol);

    if (!data) {
      results.push({ symbol: stock.symbol, status: "failed" });
      continue;
    }

    const { error: updateError } = await supabase
      .from("stocks")
      .update({
        price: data.price,
        change_rate: data.changeRate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", stock.id);

    results.push({
      symbol: stock.symbol,
      status: updateError ? "db_error" : "ok",
      price: data.price,
      changeRate: data.changeRate,
    });
  }

  const succeeded = results.filter((r) => r.status === "ok").length;
  const failed = results.filter((r) => r.status !== "ok").length;

  return res.status(200).json({
    message: `✅ ${succeeded}개 성공, ❌ ${failed}개 실패`,
    results,
  });
}
