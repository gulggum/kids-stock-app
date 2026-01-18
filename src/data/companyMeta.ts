// 📌 아이 눈높이에 맞춘 회사 설명 데이터

export const companyMeta: Record<
  string,
  {
    name: string;
    description: string;
    category: string;
    character: string;
  }
> = {
  "1": {
    name: "삼성전자",
    description: "우리가 쓰는 핸드폰과 TV를 만드는 회사예요",
    category: "전자",
    character: "🤖",
  },
  "2": {
    name: "농심",
    description: "맛있는 라면과 과자를 만드는 회사예요",
    category: "식품",
    character: "🍜",
  },
  "3": {
    name: "현대차",
    description: "사람들이 타는 자동차를 만드는 회사예요",
    category: "자동차",
    character: "🚗",
  },
};
