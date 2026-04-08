// api/update-stocks.js
// Vercel Serverless Function
// 용도 1: 브라우저에서 직접 호출 → 즉시 가격 채우기
// 용도 2: vercel.json Cron 등록 → 매일 평일 오전 9시(KST) 자동 실행
// 실행 내용: 전체 종목 시세 업데이트 + 원/달러 환율 업데이트

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Yahoo Finance에서 주식 시세 가져오기
async function fetchPrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
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

// Yahoo Finance에서 원/달러 환율 가져오기 (KRW=X 심볼)
async function fetchExchangeRate() {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/KRW%3DX?interval=1d&range=1d`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const json = await res.json();
    // KRW=X → 달러당 원화 (예: 1350)
    const rate = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
    return rate ? Math.round(rate) : null;
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ① 환율 업데이트
  const rate = await fetchExchangeRate();
  if (rate) {
    await supabase
      .from("settings")
      .update({ value: String(rate) })
      .eq("key", "exchange_rate");
  }

  // ② 종목 시세 업데이트
  const { data: stocks, error } = await supabase
    .from("stocks")
    .select("id, symbol");

  if (error || !stocks) {
    return res.status(500).json({ error: "stocks 조회 실패" });
  }

  const results = [];

  for (const stock of stocks) {
    await sleep(300);

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
    message: `✅ ${succeeded}개 성공, ❌ ${failed}개 실패 / 환율: ${rate ?? "실패"}원`,
    results,
  });
}
