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
];
