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
    // 🟡 오늘 뉴스
    {
      id: "news_today_1",
      title: "AI 컴퓨터가 많아지면서 반도체 회사가 주목받고 있어요",
      summary:
        "AI 컴퓨터와 스마트폰이 많아지면서 반도체가 많이 필요해졌어요. 그래서 반도체를 만드는 회사들이 주목받고 있어요.",
      stockId: "1", // 삼성전자
      type: "today",
    },
    {
      id: "news_today_2",
      title: "AI 게임과 로봇 기술이 발전하면서 그래픽카드 회사가 인기예요",
      summary:
        "AI와 게임을 만들 때는 아주 빠른 컴퓨터 부품이 필요해요. 이런 부품을 만드는 회사가 요즘 많은 관심을 받고 있어요.",
      stockId: "106", // Nvidia
      type: "today",
    },

    // 🔵 어제 놓친 뉴스
    {
      id: "news_missed_1",
      title: "전기 자동차가 점점 많아지고 있어요",
      summary:
        "기름 대신 전기로 움직이는 자동차가 세계에서 점점 많아지고 있어요. 그래서 전기차 회사들도 관심을 받고 있어요.",
      stockId: "105", // Tesla
      type: "missed",
    },
    {
      id: "news_missed_2",
      title: "스마트폰을 만드는 회사가 새 제품을 준비 중이에요",
      summary:
        "스마트폰 회사가 더 빠르고 좋은 기능이 있는 새로운 제품을 준비하고 있다는 소식이 있어요.",
      stockId: "101", // Apple
      type: "missed",
    },
  ],

  quizzes: [
    {
      newsId: "news_today_1",
      question: "반도체는 어디에 많이 사용될까요?",
      options: ["컴퓨터와 스마트폰", "축구공", "연필"],
      answerIndex: 0,
    },
    {
      newsId: "news_today_2",
      question: "AI 게임과 로봇을 만들 때 필요한 것은 무엇일까요?",
      options: ["빠른 컴퓨터 부품", "물", "종이"],
      answerIndex: 0,
    },
    {
      newsId: "news_missed_1",
      question: "전기차는 무엇으로 움직일까요?",
      options: ["전기", "물", "바람"],
      answerIndex: 0,
    },
    {
      newsId: "news_missed_2",
      question: "스마트폰 회사가 새 제품을 만들면 무엇이 좋아질까요?",
      options: [
        "더 빠르고 좋은 기능이 생길 수 있어요",
        "휴대폰이 사라져요",
        "전화가 안돼요",
      ],
      answerIndex: 0,
    },
  ],

  date: new Date().toISOString().slice(0, 10),
};
