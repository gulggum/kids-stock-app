export type HomeNews = {
  id: string;
  title: string;
  summary: string;
  stockId: string; //연결될 주식
  type: "today" | "missed";
};

export type NewsQuiz = {
  newsId: string;
  question: string;
  options: string[];
  answerIndex: number;
};
export type NewsResponse = {
  news: HomeNews[];
  quizzes: NewsQuiz[];
  date: string;
};

export const mockNewsData: NewsResponse = {
  news: [
    {
      id: "news_0",
      title: "오늘 반도체 회사가 돈을 많이 벌었어요",
      summary:
        "컴퓨터와 스마트폰에 들어가는 반도체를 많이 팔아서 회사가 돈을 많이 벌었어요.",
      stockId: "0",
      type: "today",
    },
    {
      id: "news_1",
      title: "전기차가 점점 많아지고 있어요",
      summary: "기름 대신 전기를 사용하는 자동차가 점점 많아지고 있어요.",
      stockId: "1",
      type: "today",
    },
    {
      id: "news_2",
      title: "어제는 게임 회사 주식이 올랐어요",
      summary: "새로운 게임이 인기를 얻으면서 게임 회사의 가치가 올라갔어요.",
      stockId: "2",
      type: "missed",
    },
  ],

  quizzes: [
    {
      newsId: "news_0",
      question: "반도체는 어디에 많이 사용될까요?",
      options: ["컴퓨터와 스마트폰", "자동차 바퀴", "축구공"],
      answerIndex: 0,
    },
    {
      newsId: "news_1",
      question: "전기차 회사가 주목받는 이유는 무엇일까요?",
      options: [
        "차가 시끄러워서",
        "기름을 많이 써서",
        "전기를 사용해 환경에 도움이 되어서",
      ],
      answerIndex: 2,
    },
    {
      newsId: "news_2",
      question: "게임 회사 주식이 오른 이유는?",
      options: [
        "사람들이 게임을 더 많이 해서",
        "건물이 커져서",
        "직원이 줄어서",
      ],
      answerIndex: 0,
    },
  ],

  date: new Date().toISOString().slice(0, 10),
};
