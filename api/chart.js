// 📁 /api/chart.js
// ✔ 역할: 특정 종목(symbol)의 차트 데이터 반환
// ✔ Yahoo Finance에서 기간별 데이터 가져옴 (7일 / 30일)
// ✔ 프론트는 이 API만 호출하면 됨 (외부 API 숨김)

export default async function handler(req, res) {
  try {
    const { symbol, period = "7d" } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: "symbol required" });
    }

    // 🔥 기간별 설정
    // 7일 / 30일 버튼 대응
    const range = period === "30d" ? "1mo" : "7d";
    const interval = "1d";

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const json = await response.json();

    const result = json?.chart?.result?.[0];
    if (!result) {
      return res.status(500).json({ error: "no chart data" });
    }

    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;

    // 🔥 프론트에서 쓰기 좋은 형태로 변환
    const chartData = timestamps.map((t, i) => ({
      date: new Date(t * 1000).toLocaleDateString(), // 날짜
      price: prices[i] ?? 0,
    }));

    return res.status(200).json({
      symbol,
      period,
      data: chartData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "chart fetch failed" });
  }
}
