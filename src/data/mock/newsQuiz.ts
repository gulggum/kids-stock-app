export type NewsQuiz = {
  newsId: string;
  question: string;
  options: string[];
  answerIndex: number;
};

export const newsQuizzes: NewsQuiz[] = [
  {
    newsId: "today",
    question: "AI를 쓰는 회사가 주목받는 이유는?",
    options: ["사람이 줄어서", "일을 더 빠르게 할 수 있어서", "가격이 내려서"],
    answerIndex: 1,
  },
  // ✅ 놓친 뉴스 3
  {
    newsId: "miss_1",
    question: "전기차 회사가 주목받는 이유는 무엇일까요?",
    options: [
      "차가 시끄러워서",
      "기름을 많이 써서",
      "전기를 사용해 환경에 도움이 되어서",
    ],
    answerIndex: 2,
  },
  {
    newsId: "miss_2",
    question: "게임 회사의 주가가 오를 수 있는 이유는?",
    options: ["사람들이 게임을 더 많이 해서", "건물이 커져서", "직원이 줄어서"],
    answerIndex: 0,
  },
  {
    newsId: "miss_3",
    question: "환경 기술 회사가 관심을 받는 이유는 무엇일까요?",
    options: [
      "공장을 많이 지어서",
      "환경을 지키는 기술을 만들기 때문에",
      "주식이 비싸서",
    ],
    answerIndex: 1,
  },
];
