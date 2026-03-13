export type NewsType = "today" | "yesterday";
export type NewsCountry = "KR" | "US";

export type HomeNews = {
  id: string;
  title: string;
  summary: string;
  stockId?: string; // 연결 기업
  type: NewsType; // today | yesterday
  country: NewsCountry; // KR | US
  createdAt: string; // 날짜
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
    // =============================
    // 🟡 오늘 뉴스 - 한국
    // =============================

    {
      id: "news_today_kr_1",
      title: "AI 컴퓨터가 많아지면서 반도체 회사가 주목받고 있어요",
      summary:
        "AI 컴퓨터와 스마트폰이 많아지면서 반도체가 더 많이 필요해졌어요. 그래서 반도체를 만드는 회사들이 투자자들의 관심을 받고 있어요.",
      stockId: "1",
      type: "today",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_kr_2",
      title: "한국 전기차 배터리 회사들이 새로운 기술을 만들고 있어요",
      summary:
        "전기 자동차가 늘어나면서 배터리 기술이 중요해지고 있어요. 한국 배터리 회사들도 새로운 기술을 개발하고 있어요.",
      stockId: "3",
      type: "today",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_kr_3",
      title: "한국 게임 회사가 새로운 인기 게임을 준비하고 있어요",
      summary:
        "한국 게임 회사들이 새로운 게임을 만들고 있어요. 재미있는 게임이 나오면 많은 사람들이 게임을 즐길 수 있어요.",
      stockId: "4",
      type: "today",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    // =============================
    // 🌎 오늘 뉴스 - 해외
    // =============================

    {
      id: "news_today_us_1",
      title: "AI 기술이 발전하면서 그래픽카드 회사가 인기예요",
      summary:
        "AI와 게임을 만들 때는 빠른 컴퓨터 부품이 필요해요. 이런 부품을 만드는 회사가 요즘 많은 관심을 받고 있어요.",
      stockId: "106",
      type: "today",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_us_2",
      title: "전기 자동차 회사들이 새로운 모델을 준비하고 있어요",
      summary:
        "전기로 움직이는 자동차가 세계에서 점점 많아지고 있어요. 전기차 회사들도 새로운 자동차를 만들고 있어요.",
      stockId: "105",
      type: "today",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_us_3",
      title: "스마트폰 회사가 더 빠른 새로운 휴대폰을 만들고 있어요",
      summary:
        "스마트폰 회사들이 더 빠르고 좋은 기능이 있는 휴대폰을 준비하고 있어요. 새로운 기술도 함께 들어갈 예정이에요.",
      stockId: "101",
      type: "today",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    // =============================
    // 🔵 어제 뉴스 - 한국
    // =============================

    {
      id: "news_yesterday_kr_1",
      title: "한국 반도체 공장이 더 크게 만들어질 예정이에요",
      summary:
        "반도체를 만드는 공장이 더 크게 만들어질 예정이에요. 반도체 수요가 계속 늘어나고 있기 때문이에요.",
      stockId: "1",
      type: "yesterday",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_kr_2",
      title: "한국 인터넷 회사가 새로운 AI 서비스를 준비하고 있어요",
      summary:
        "인터넷 회사들이 AI 기술을 이용해 새로운 서비스를 준비하고 있어요. 앞으로 더 편리한 서비스가 나올 수 있어요.",
      stockId: "5",
      type: "yesterday",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_kr_3",
      title: "한국 자동차 회사가 새로운 전기차 계획을 발표했어요",
      summary:
        "한국 자동차 회사가 새로운 전기차 계획을 발표했어요. 앞으로 전기차 시장이 더 커질 것으로 예상돼요.",
      stockId: "6",
      type: "yesterday",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    // =============================
    // 🌎 어제 뉴스 - 해외
    // =============================

    {
      id: "news_yesterday_us_1",
      title: "AI 기술을 이용한 새로운 서비스가 발표됐어요",
      summary:
        "AI 기술을 이용해 새로운 서비스를 만드는 회사들이 많아지고 있어요. AI 시장이 점점 커지고 있어요.",
      stockId: "106",
      type: "yesterday",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_us_2",
      title: "전기차 충전소가 더 많이 만들어지고 있어요",
      summary:
        "전기차를 충전할 수 있는 충전소가 세계 곳곳에 늘어나고 있어요. 전기차를 사용하기 더 편해질 거예요.",
      stockId: "105",
      type: "yesterday",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_us_3",
      title: "컴퓨터 회사가 새로운 AI 컴퓨터를 공개했어요",
      summary:
        "AI 기술을 사용할 수 있는 새로운 컴퓨터가 공개됐어요. 앞으로 AI 기술이 더 많이 사용될 거예요.",
      stockId: "102",
      type: "yesterday",
      country: "US",
      createdAt: new Date().toISOString(),
    },
  ],

  quizzes: [
    {
      newsId: "news_today_kr_1",
      question: "반도체는 어디에 많이 사용될까요?",
      options: ["컴퓨터와 스마트폰", "축구공", "연필"],
      answerIndex: 0,
    },
    {
      newsId: "news_today_kr_2",
      question: "전기차 배터리는 어디에 사용될까요?",
      options: ["전기 자동차", "종이", "책"],
      answerIndex: 0,
    },
    {
      newsId: "news_today_kr_3",
      question: "게임 회사는 무엇을 만들까요?",
      options: ["게임", "의자", "우산"],
      answerIndex: 0,
    },

    {
      newsId: "news_today_us_1",
      question: "AI와 게임을 만들 때 필요한 것은 무엇일까요?",
      options: ["빠른 컴퓨터 부품", "물", "종이"],
      answerIndex: 0,
    },
    {
      newsId: "news_today_us_2",
      question: "전기차는 무엇으로 움직일까요?",
      options: ["전기", "물", "바람"],
      answerIndex: 0,
    },
    {
      newsId: "news_today_us_3",
      question: "스마트폰 회사는 무엇을 만들까요?",
      options: ["휴대폰", "냉장고", "자전거"],
      answerIndex: 0,
    },

    {
      newsId: "news_yesterday_kr_1",
      question: "반도체 공장은 무엇을 만들까요?",
      options: ["반도체", "연필", "공"],
      answerIndex: 0,
    },
    {
      newsId: "news_yesterday_kr_2",
      question: "AI 서비스는 무엇을 이용할까요?",
      options: ["AI 기술", "나무", "돌"],
      answerIndex: 0,
    },
    {
      newsId: "news_yesterday_kr_3",
      question: "자동차 회사는 어떤 자동차를 만들고 있을까요?",
      options: ["전기 자동차", "비행기", "배"],
      answerIndex: 0,
    },

    {
      newsId: "news_yesterday_us_1",
      question: "AI 기술을 이용하면 무엇이 발전할까요?",
      options: ["서비스", "나무", "모래"],
      answerIndex: 0,
    },
    {
      newsId: "news_yesterday_us_2",
      question: "전기차 충전소는 무엇을 위해 필요할까요?",
      options: ["전기차 충전", "책 읽기", "잠자기"],
      answerIndex: 0,
    },
    {
      newsId: "news_yesterday_us_3",
      question: "AI 컴퓨터는 무엇을 위해 만들어질까요?",
      options: ["AI 기술 사용", "종이 접기", "운동"],
      answerIndex: 0,
    },
  ],

  date: new Date().toISOString().slice(0, 10),
};
