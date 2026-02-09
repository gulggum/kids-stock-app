// 📌 아이 눈높이에 맞춘 회사 설명 데이터

export type CompanyMeta = {
  id: string;
  name: string;
  description: string;
  category: string;
  character: string;

  // ⬇️ MVP용 임시 데이터
  price: number;
  changeRate: number;
};

export const companyMeta: Record<string, CompanyMeta> = {
  "1": {
    id: "1",
    name: "삼성전자",
    description: "우리가 쓰는 핸드폰과 TV를 만드는 회사예요",
    category: "전자",
    character: "🤖",
    price: 72000,
    changeRate: 1.8,
  },
  "2": {
    id: "2",
    name: "농심",
    description: "맛있는 라면과 과자를 만드는 회사예요",
    category: "식품",
    character: "🍜",
    price: 410000,
    changeRate: -0.7,
  },
  "3": {
    id: "3",
    name: "현대차",
    description: "사람들이 타는 자동차를 만드는 회사예요",
    category: "자동차",
    character: "🚗",
    price: 182000,
    changeRate: 0.4,
  },
};
