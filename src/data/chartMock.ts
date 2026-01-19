//주식 특성상 시간에 따라 바뀌는 데이터
//가격이 오르락내리락하는 “흐름”
// 화면에 차트를 그리기 위해 임시로 만든 데이터

export type ChartPoint = {
  date: string;
  price: number;
};

export type ChartPeriod = "7d" | "30d";

type CompanyChartData = {
  [period in ChartPeriod]: ChartPoint[];
};

export const chartMock: Record<string, CompanyChartData> = {
  "1": {
    // 삼성전자 – 비교적 안정적
    "7d": [
      { date: "1", price: 70000 },
      { date: "2", price: 71000 },
      { date: "3", price: 70500 },
      { date: "4", price: 72000 },
      { date: "5", price: 71500 },
      { date: "6", price: 72500 },
      { date: "7", price: 72000 },
    ],
    "30d": Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      price: Math.round(68000 + i * 200),
    })),
  },

  "2": {
    // 농심 – 등락 조금 있음
    "7d": [
      { date: "1", price: 400000 },
      { date: "2", price: 405000 },
      { date: "3", price: 398000 },
      { date: "4", price: 410000 },
      { date: "5", price: 408000 },
      { date: "6", price: 415000 },
      { date: "7", price: 410000 },
    ],
    "30d": Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      price: Math.round(390000 + Math.sin(i / 3) * 15000),
    })),
  },

  "3": {
    // 현대차 – 점진적 상승
    "7d": [
      { date: "1", price: 175000 },
      { date: "2", price: 176000 },
      { date: "3", price: 178000 },
      { date: "4", price: 179000 },
      { date: "5", price: 180000 },
      { date: "6", price: 181000 },
      { date: "7", price: 182000 },
    ],
    "30d": Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      price: Math.round(165000 + i * 600),
    })),
  },
};
