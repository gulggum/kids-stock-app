export type NewsType = "today" | "yesterday";
export type NewsCountry = "KR" | "US";

export type HomeNews = {
  id: string;
  title: string;
  summary: string;
  image?: string;
  stockIds?: number[]; // ⭐ 연결 기업 여러개
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
        "AI 컴퓨터와 스마트폰이 많아지면서 반도체가 더 많이 필요해졌어요. 그래서 반도체 회사들이 관심을 받고 있어요.",
      image: "https://picsum.photos/seed/chip/400/240",
      stockIds: [1, 2],
      type: "today",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_kr_2",
      title: "전기 자동차가 늘어나면서 배터리 회사도 바빠지고 있어요",
      summary:
        "전기 자동차가 많아지면서 배터리를 만드는 회사도 바빠지고 있어요.",
      image: "https://picsum.photos/seed/battery/400/240",
      stockIds: [7, 8],
      type: "today",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_kr_3",
      title: "한국 게임 회사가 새로운 게임을 준비하고 있어요",
      summary: "한국 게임 회사들이 새로운 게임을 준비하고 있어요.",
      image: "https://picsum.photos/seed/game/400/240",
      stockIds: [15, 14],
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
      summary: "AI를 만들거나 게임을 할 때 그래픽카드가 필요해요.",
      image: "https://picsum.photos/seed/gpu/400/240",
      stockIds: [106, 102],
      type: "today",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_us_2",
      title: "전기 자동차 회사들이 새로운 모델을 준비하고 있어요",
      summary:
        "전기 자동차 회사들이 더 멀리 갈 수 있는 새로운 자동차를 준비하고 있어요.",
      image: "https://picsum.photos/seed/ev/400/240",
      stockIds: [105],
      type: "today",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_today_us_3",
      title: "스마트폰 회사가 더 빠른 새로운 휴대폰을 만들고 있어요",
      summary:
        "스마트폰 회사들이 더 빠르고 더 똑똑한 기능이 있는 휴대폰을 만들고 있어요.",
      image: "https://picsum.photos/seed/phone/400/240",
      stockIds: [101, 103],
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
        "반도체 수요가 늘어나면서 한국에 더 큰 반도체 공장이 만들어질 예정이에요.",
      image: "https://picsum.photos/seed/factory/400/240",
      stockIds: [1, 2],
      type: "yesterday",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_kr_2",
      title: "한국 인터넷 회사가 새로운 AI 서비스를 준비하고 있어요",
      summary:
        "인터넷 회사들이 AI 기술을 이용한 새로운 서비스를 준비하고 있어요.",
      image: "https://picsum.photos/seed/ai/400/240",
      stockIds: [5, 6],
      type: "yesterday",
      country: "KR",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_kr_3",
      title: "한국 자동차 회사가 새로운 전기차 계획을 발표했어요",
      summary:
        "한국 자동차 회사가 새로운 전기차 계획을 발표하면서 전기차 시장이 더 커질 것으로 기대돼요.",
      image: "https://picsum.photos/seed/car/400/240",
      stockIds: [3, 4],
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
      summary: "AI 기술을 활용한 새로운 서비스들이 계속 등장하고 있어요.",
      image: "https://picsum.photos/seed/tech/400/240",
      stockIds: [106, 103],
      type: "yesterday",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_us_2",
      title: "전기차 충전소가 세계 곳곳에 늘어나고 있어요",
      summary: "전기 자동차가 많아지면서 충전소도 더 많이 만들어지고 있어요.",
      image: "https://picsum.photos/seed/charger/400/240",
      stockIds: [105],
      type: "yesterday",
      country: "US",
      createdAt: new Date().toISOString(),
    },

    {
      id: "news_yesterday_us_3",
      title: "컴퓨터 회사가 새로운 AI 컴퓨터를 공개했어요",
      summary:
        "AI 기능을 사용할 수 있는 새로운 컴퓨터가 공개되면서 많은 관심을 받고 있어요.",
      image: "https://picsum.photos/seed/computer/400/240",
      stockIds: [102, 101],
      type: "yesterday",
      country: "US",
      createdAt: new Date().toISOString(),
    },
  ],

  quizzes: [
    {
      newsId: "news_today_kr_1",
      question: "반도체는 어디에 많이 사용될까요?",
      options: ["축구공", "컴퓨터와 스마트폰", "연필"],
      answerIndex: 1,
    },
    {
      newsId: "news_today_kr_2",
      question: "전기차 배터리는 어디에 사용될까요?",
      options: ["책", "종이", "전기 자동차"],
      answerIndex: 2,
    },
    {
      newsId: "news_today_kr_3",
      question: "게임 회사는 무엇을 만들까요?",
      options: ["게임", "우산", "의자"],
      answerIndex: 0,
    },

    {
      newsId: "news_today_us_1",
      question: "AI와 게임을 만들 때 필요한 것은 무엇일까요?",
      options: ["물", "빠른 컴퓨터 부품", "종이"],
      answerIndex: 1,
    },
    {
      newsId: "news_today_us_2",
      question: "전기차는 무엇으로 움직일까요?",
      options: ["전기", "바람", "물"],
      answerIndex: 0,
    },
    {
      newsId: "news_today_us_3",
      question: "스마트폰 회사는 무엇을 만들까요?",
      options: ["냉장고", "자전거", "휴대폰"],
      answerIndex: 2,
    },

    {
      newsId: "news_yesterday_kr_1",
      question: "반도체 공장은 무엇을 만들까요?",
      options: ["공", "반도체", "연필"],
      answerIndex: 1,
    },
    {
      newsId: "news_yesterday_kr_2",
      question: "AI 서비스는 무엇을 이용할까요?",
      options: ["돌", "AI 기술", "나무"],
      answerIndex: 1,
    },
    {
      newsId: "news_yesterday_kr_3",
      question: "자동차 회사는 어떤 자동차를 만들고 있을까요?",
      options: ["비행기", "전기 자동차", "배"],
      answerIndex: 1,
    },

    {
      newsId: "news_yesterday_us_1",
      question: "AI 기술을 이용하면 무엇이 발전할까요?",
      options: ["서비스", "모래", "나무"],
      answerIndex: 0,
    },
    {
      newsId: "news_yesterday_us_2",
      question: "전기차 충전소는 무엇을 위해 필요할까요?",
      options: ["잠자기", "전기차 충전", "책 읽기"],
      answerIndex: 1,
    },
    {
      newsId: "news_yesterday_us_3",
      question: "AI 컴퓨터는 무엇을 위해 만들어질까요?",
      options: ["운동", "종이 접기", "AI 기술 사용"],
      answerIndex: 2,
    },
  ],

  date: new Date().toISOString().slice(0, 10),
};
