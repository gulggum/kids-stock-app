//주식 특성상 시간에 따라 바뀌는 데이터
//가격이 오르락내리락하는 “흐름”
// 화면에 차트를 그리기 위해 임시로 만든 데이터

export type ChartPoint = {
  date: string;
  price: number;
};

export type ChartPeriod = "7d" | "1y";

type CompanyChartData = {
  [period in ChartPeriod]: ChartPoint[];
};

const generate7d = (base: number, volatility = 0.02): ChartPoint[] => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: `${i + 1}`,
    price: Math.round(base * (1 + (Math.random() - 0.5) * volatility)),
  }));
};

const generate1y = (base: number, trend = 0.0008): ChartPoint[] => {
  return Array.from({ length: 365 }, (_, i) => ({
    date: `${i + 1}`,
    price: Math.round(base * (1 + trend * i + Math.sin(i / 20) * 0.05)),
  }));
};

const createCompany = (base: number): CompanyChartData => ({
  "7d": generate7d(base),
  "1y": generate1y(base),
});

export const chartMock: Record<string, CompanyChartData> = {
  // 🇰🇷 한국 기업
  "1": createCompany(72000),
  "2": createCompany(138000),
  "3": createCompany(182000),
  "4": createCompany(98000),
  "5": createCompany(210000),
  "6": createCompany(56000),
  "7": createCompany(420000),
  "8": createCompany(350000),
  "9": createCompany(480000),
  "10": createCompany(390000),
  "11": createCompany(32000),
  "12": createCompany(410000),
  "13": createCompany(390000),
  "14": createCompany(260000),
  "15": createCompany(240000),

  // 🇺🇸 미국 기업
  "101": createCompany(230000),
  "102": createCompany(410000),
  "103": createCompany(170000),
  "104": createCompany(180000),
  "105": createCompany(250000),
  "106": createCompany(900000),
  "107": createCompany(390000),
  "108": createCompany(610000),
  "109": createCompany(150000),
  "110": createCompany(75000),
  "111": createCompany(130000),
  "112": createCompany(220000),
};
