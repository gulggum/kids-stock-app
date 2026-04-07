// ID 대신 symbol(종목코드)을 키로 변경
// → Supabase ID가 바뀌어도 절대 안 깨짐

export type ChartPoint = { date: string; price: number };
export type ChartPeriod = "7d" | "1y";
type CompanyChartData = { [period in ChartPeriod]: ChartPoint[] };

const generate7d = (base: number, volatility = 0.02): ChartPoint[] =>
  Array.from({ length: 7 }, (_, i) => ({
    date: `${i + 1}`,
    price: Math.round(base * (1 + (Math.random() - 0.5) * volatility)),
  }));

const generate1y = (base: number, trend = 0.0008): ChartPoint[] =>
  Array.from({ length: 365 }, (_, i) => ({
    date: `${i + 1}`,
    price: Math.round(base * (1 + trend * i + Math.sin(i / 20) * 0.05)),
  }));

const c = (base: number): CompanyChartData => ({
  "7d": generate7d(base),
  "1y": generate1y(base),
});

// 🇰🇷 한국 — symbol: "005930.KS" 형식
export const chartMock: Record<string, CompanyChartData> = {
  "005930.KS": c(72000), // 삼성전자
  "000660.KS": c(138000), // SK하이닉스
  "373220.KS": c(420000), // LG에너지솔루션
  "207940.KS": c(800000), // 삼성바이오로직스
  "005380.KS": c(182000), // 현대차
  "000270.KS": c(98000), // 기아
  "005490.KS": c(390000), // POSCO
  "051910.KS": c(480000), // LG화학
  "035420.KS": c(210000), // NAVER
  "035720.KS": c(56000), // 카카오
  "068270.KS": c(190000), // 셀트리온
  "105560.KS": c(82000), // KB금융
  "055550.KS": c(55000), // 신한지주
  "086790.KS": c(60000), // 하나금융지주
  "006400.KS": c(350000), // 삼성SDI
  "323410.KS": c(26000), // 카카오뱅크
  "259960.KS": c(240000), // 크래프톤
  "251270.KS": c(60000), // 넷마블
  "293490.KS": c(18000), // 카카오게임즈
  "041510.KS": c(85000), // SM엔터
  "352820.KS": c(260000), // 하이브
  "023530.KS": c(120000), // 롯데쇼핑
  "090430.KS": c(130000), // 아모레퍼시픽
  "011200.KS": c(18000), // HMM
  "012450.KS": c(350000), // 한화에어로스페이스
  "004370.KS": c(410000), // 농심
  "271560.KS": c(120000), // 오리온
  "097950.KS": c(380000), // CJ제일제당
  "005180.KS": c(130000), // 빙그레
  "015760.KS": c(22000), // 한국전력
  "017670.KS": c(55000), // SK텔레콤

  // 🇺🇸 미국 — symbol: "AAPL" 형식
  AAPL: c(230000), // Apple
  MSFT: c(410000), // Microsoft
  NVDA: c(900000), // NVIDIA
  AMZN: c(180000), // Amazon
  GOOGL: c(170000), // Alphabet
  META: c(390000), // Meta
  TSLA: c(250000), // Tesla
  JPM: c(200000), // JPMorgan
  JNJ: c(160000), // J&J
  XOM: c(120000), // ExxonMobil
  "BRK-B": c(350000), // Berkshire
  V: c(280000), // Visa
  WMT: c(200000), // Walmart
  DIS: c(150000), // Disney
  NFLX: c(610000), // Netflix
  PFE: c(40000), // Pfizer
  KO: c(75000), // Coca-Cola
  MCD: c(220000), // McDonald's
  NKE: c(130000), // Nike
  CRM: c(300000), // Salesforce
  AMD: c(180000), // AMD
  PYPL: c(90000), // PayPal
  SPOT: c(400000), // Spotify
  ABNB: c(180000), // Airbnb
  UBER: c(80000), // Uber
  SBUX: c(100000), // Starbucks
  DPZ: c(400000), // Domino's
  HSY: c(200000), // Hershey
  K: c(80000), // Kellanova
  HAS: c(70000), // Hasbro
  MAT: c(50000), // Mattel
  CMCSA: c(150000), // Comcast
  NTDOY: c(140000), // Nintendo
};

// symbol이 없는 경우 가격 기반으로 즉석 생성 (안전망)
export const getChartData = (
  symbol: string,
  basePrice: number,
  period: ChartPeriod,
): ChartPoint[] => {
  return (
    chartMock[symbol]?.[period] ??
    (period === "7d" ? generate7d(basePrice) : generate1y(basePrice))
  );
};
