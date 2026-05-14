//---목표 달성 보상 ---
/**
 * 🏆 업적 시스템
 * - 조건 감지
 * - 뱃지 정보
 * - 업적 전용 보상
 * /**
 * 🏅 업적 규칙
 * - 특정 조건 달성 시 지급
 * - 도전/성과 기록용

 */

export type AchievementState = {
  totalTrades: number; // 구매 횟수만 (재방문 유도 지표)
  totalSells: number; // 판매 횟수 별도 (손실/수익 계산용)
  totalAsset: number; // 현재 총 자산 (보유 현금 + 주식 평가액)
  level: number; // 현재 레벨 (exp 기반 계산)
  streak: number; // 연속 출석 일수
  totalQuizCorrect: number; // 퀴즈 누적 정답 횟수
  totalLoss: number; // 손실 매도 누적 횟수 (산 가격보다 낮게 판 횟수)
  hasBankrupt: boolean; // 파산 경험 여부 (자산이 0 이하로 떨어진 적 있는지)
  uniqueStocks: number; // 보유해본 종목 수 (중복 제외, 한 번이라도 산 종목)
  totalNewsRead: number; // 뉴스 누적 읽은 횟수
  totalKnowledge: number; //오늘의지식 횟수
};
export type Achievement = {
  id: string;
  tier: "COMMON" | "RARE" | "LEGEND";
  // 🎖 뱃지 메타 정보
  badge: {
    title: string;
    description: string;
    emoji: string;
  };

  // 🎁 업적 달성 시 지급 보상
  reward: {
    coin?: number;
    exp?: number;
    score?: number;
  };

  // ✅ 달성 조건
  condition: (state: AchievementState) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  // 지식 관련 업적 추가
  {
    id: "KNOWLEDGE_5",
    tier: "COMMON",
    badge: {
      title: "지식 탐험가",
      description: "오늘의 지식을 5번 확인했어요!",
      emoji: "🧠",
    },
    reward: { coin: 20, exp: 30 },
    condition: (state) => state.totalKnowledge >= 5,
  },
  {
    id: "KNOWLEDGE_30",
    tier: "RARE",
    badge: {
      title: "지식 전문가",
      description: "오늘의 지식을 30번 확인했어요!",
      emoji: "📚",
    },
    reward: { coin: 50, exp: 60 },
    condition: (state) => state.totalKnowledge >= 30,
  },

  // ===============================
  // 📈 경제 활동 업적
  // ===============================

  {
    id: "FIRST_BUY",
    tier: "COMMON",
    badge: {
      title: "첫 경제 체험",
      description: "처음으로 기업을 선택했어요! 새로운 경험이 시작되었어요!",
      emoji: "🌱",
    },
    reward: { coin: 20, exp: 30 },
    condition: (state) => state.totalTrades >= 1,
  },

  {
    id: "TRADE_5",
    tier: "COMMON",
    badge: {
      title: "활동 시작",
      description: "5번 활동했어요! 경제 흐름에 익숙해지고 있어요!",
      emoji: "📘",
    },
    reward: { coin: 30, exp: 40 },
    condition: (state) => state.totalTrades >= 5,
  },

  {
    id: "TRADE_10",
    tier: "COMMON",
    badge: {
      title: "차근차근 성장",
      description: "10번 활동했어요! 다양한 경험이 쌓이고 있어요!",
      emoji: "📈",
    },
    reward: { coin: 40, exp: 50 },
    condition: (state) => state.totalTrades >= 10,
  },

  {
    id: "TRADE_20",
    tier: "RARE",
    badge: {
      title: "경제 감각 업!",
      description: "20번 활동했어요! 시장 흐름을 잘 이해하고 있어요!",
      emoji: "💡",
    },
    reward: { coin: 60, exp: 70 },
    condition: (state) => state.totalTrades >= 20,
  },

  {
    id: "TRADE_35",
    tier: "RARE",
    badge: {
      title: "꾸준한 탐험가",
      description: "35번 활동했어요! 경제 감각이 자라고 있어요!",
      emoji: "🔍",
    },
    reward: { coin: 80, exp: 90 },
    condition: (state) => state.totalTrades >= 35,
  },

  {
    id: "TRADE_50",
    tier: "LEGEND",
    badge: {
      title: "활동 마스터",
      description: "50번 활동했어요! 멋진 경험을 이어가고 있어요!",
      emoji: "🏅",
    },
    reward: { coin: 120, exp: 120, score: 15 },
    condition: (state) => state.totalTrades >= 50,
  },

  // ===============================
  // 📊 기업 탐험 업적
  // ===============================

  {
    id: "STOCK_3_KINDS",
    tier: "COMMON",
    badge: {
      title: "기업 탐험가",
      description: "3가지 기업을 경험했어요! 다양한 기업을 알아가고 있어요!",
      emoji: "🌈",
    },
    reward: { coin: 30, exp: 30 },
    condition: (state) => state.uniqueStocks >= 3,
  },

  {
    id: "STOCK_5_KINDS",
    tier: "COMMON",
    badge: {
      title: "다양한 경험 시작",
      description: "5가지 종목을 경험했어요! 활동 범위가 넓어지고 있어요!",
      emoji: "🧩",
    },
    reward: { coin: 50, exp: 50 },
    condition: (state) => state.uniqueStocks >= 5,
  },

  {
    id: "STOCK_8_KINDS",
    tier: "RARE",
    badge: {
      title: "시장 탐험 중",
      description: "8가지 기업을 경험했어요! 다양한 흐름을 살펴보고 있어요!",
      emoji: "🧭",
    },
    reward: { coin: 70, exp: 70 },
    condition: (state) => state.uniqueStocks >= 8,
  },

  {
    id: "STOCK_12_KINDS",
    tier: "RARE",
    badge: {
      title: "경제 탐험가",
      description: "12가지 기업을 경험했어요! 경제 감각이 자라고 있어요!",
      emoji: "🌍",
    },
    reward: { coin: 100, exp: 90, score: 10 },
    condition: (state) => state.uniqueStocks >= 12,
  },

  {
    id: "STOCK_20_KINDS",
    tier: "LEGEND",
    badge: {
      title: "경제 마스터",
      description:
        "20가지 기업을 경험했어요! 멋진 경제 활동을 이어가고 있어요!",
      emoji: "🏆",
    },
    reward: { coin: 150, exp: 120, score: 20 },
    condition: (state) => state.uniqueStocks >= 20,
  },

  // ===============================
  // 💰 경제 성장 업적
  // ===============================

  {
    id: "FIRST_PROFIT",
    tier: "COMMON",
    badge: {
      title: "첫 성장 경험",
      description: "활동 기록이 성장하고 있어요! 차근차근 배우고 있어요!",
      emoji: "⭐",
    },
    reward: { coin: 30, exp: 30 },
    condition: (state) => state.totalAsset > 5000000,
  },

  {
    id: "ASSET_520",
    tier: "COMMON",
    badge: {
      title: "조금씩 성장 중",
      description: "경제 감각이 자라고 있어요!",
      emoji: "🌿",
    },
    reward: { coin: 20, exp: 20 },
    condition: (state) => state.totalAsset >= 5200000,
  },

  {
    id: "ASSET_550",
    tier: "COMMON",
    badge: {
      title: "경제 체험 시작",
      description: "다양한 기업을 경험하고 있어요!",
      emoji: "💰",
    },
    reward: { coin: 40, exp: 50 },
    condition: (state) => state.totalAsset >= 5500000,
  },

  {
    id: "ASSET_600",
    tier: "RARE",
    badge: {
      title: "경제 감각 업!",
      description: "경제 흐름을 잘 이해하고 있어요!",
      emoji: "📊",
    },
    reward: { coin: 55, exp: 60 },
    condition: (state) => state.totalAsset >= 6000000,
  },

  {
    id: "ASSET_700",
    tier: "RARE",
    badge: {
      title: "성장하는 탐험가",
      description: "다양한 경험이 점점 쌓이고 있어요!",
      emoji: "🚀",
    },
    reward: { coin: 70, exp: 70 },
    condition: (state) => state.totalAsset >= 7000000,
  },

  {
    id: "ASSET_850",
    tier: "RARE",
    badge: {
      title: "경제 탐험 중",
      description: "다양한 흐름을 경험하며 배우고 있어요!",
      emoji: "💎",
    },
    reward: { coin: 100, exp: 90, score: 10 },
    condition: (state) => state.totalAsset >= 8500000,
  },

  {
    id: "ASSET_1000",
    tier: "LEGEND",
    badge: {
      title: "경제 성장 달성",
      description: "멋진 경제 경험을 이어가고 있어요!",
      emoji: "👑",
    },
    reward: { coin: 150, exp: 100, score: 20 },
    condition: (state) => state.totalAsset >= 10000000,
  },

  // ===============================
  // 😅 도전 업적
  // ===============================

  {
    id: "FIRST_LOSS",
    tier: "COMMON",
    badge: {
      title: "첫 경험 완료",
      description: "실수해도 괜찮아요! 경험은 계속 쌓이고 있어요!",
      emoji: "🙂",
    },
    reward: { exp: 30 },
    condition: (state) => state.totalLoss >= 1,
  },

  {
    id: "LOSS_10",
    tier: "COMMON",
    badge: {
      title: "다시 천천히",
      description: "천천히 다시 도전해봐요!",
      emoji: "🍀",
    },
    reward: { exp: 40, coin: 10 },
    condition: (state) => state.totalAsset <= 4500000,
  },

  {
    id: "LOSS_20",
    tier: "RARE",
    badge: {
      title: "배우는 탐험가",
      description: "실패 속에서도 경험은 계속 쌓이고 있어요!",
      emoji: "📝",
    },
    reward: { exp: 60, coin: 20 },
    condition: (state) => state.totalAsset <= 4000000,
  },

  {
    id: "LOSS_30",
    tier: "RARE",
    badge: {
      title: "포기하지 않는 마음",
      description: "다시 도전하는 용기가 정말 멋져요!",
      emoji: "🔥",
    },
    reward: { exp: 80, coin: 30 },
    condition: (state) => state.totalAsset <= 3500000,
  },

  {
    id: "BANKRUPT",
    tier: "LEGEND",
    badge: {
      title: "다시 도전!",
      description: "다시 시작하는 용기도 정말 멋져요!",
      emoji: "🛠️",
    },
    reward: { exp: 100, coin: 50 },
    condition: (state) => state.hasBankrupt === true,
  },

  // ===============================
  // 🧠 퀴즈 업적
  // ===============================

  {
    id: "QUIZ_FIRST",
    tier: "COMMON",
    badge: {
      title: "첫 퀴즈 정복",
      description: "처음으로 퀴즈를 맞혔어요!",
      emoji: "❔",
    },
    reward: { coin: 20, exp: 30 },
    condition: (state) => state.totalQuizCorrect >= 1,
  },

  {
    id: "QUIZ_5",
    tier: "COMMON",
    badge: {
      title: "경제 공부 시작",
      description: "퀴즈를 5번 맞혔어요!",
      emoji: "🖍️",
    },
    reward: { coin: 30, exp: 40 },
    condition: (state) => state.totalQuizCorrect >= 5,
  },

  {
    id: "QUIZ_10",
    tier: "RARE",
    badge: {
      title: "퀴즈 박사",
      description: "퀴즈를 10번 맞혔어요!",
      emoji: "📖",
    },
    reward: { coin: 50, exp: 60 },
    condition: (state) => state.totalQuizCorrect >= 10,
  },

  {
    id: "QUIZ_20",
    tier: "RARE",
    badge: {
      title: "경제 탐정",
      description: "퀴즈를 20번 맞혔어요!",
      emoji: "🕵️",
    },
    reward: { coin: 70, exp: 80 },
    condition: (state) => state.totalQuizCorrect >= 20,
  },

  {
    id: "QUIZ_30",
    tier: "LEGEND",
    badge: {
      title: "경제 천재",
      description: "퀴즈를 30번 맞혔어요! 정말 대단해요!",
      emoji: "🎓",
    },
    reward: { coin: 100, exp: 100, score: 15 },
    condition: (state) => state.totalQuizCorrect >= 30,
  },

  {
    id: "QUIZ_50",
    tier: "LEGEND",
    badge: {
      title: "지식 마스터",
      description: "엄청난 지식을 쌓고 있어요!",
      emoji: "🧪",
    },
    reward: { coin: 150, exp: 130, score: 25 },
    condition: (state) => state.totalQuizCorrect >= 50,
  },

  // ===============================
  // 📰 뉴스 업적
  // ===============================

  {
    id: "NEWS_FIRST",
    tier: "COMMON",
    badge: {
      title: "뉴스 탐험가",
      description: "처음으로 뉴스를 읽었어요!",
      emoji: "📰",
    },
    reward: { coin: 10, exp: 20 },
    condition: (state) => state.totalNewsRead >= 1,
  },

  {
    id: "NEWS_5",
    tier: "COMMON",
    badge: {
      title: "경제 새싹",
      description: "뉴스를 5개 읽었어요!",
      emoji: "🍃",
    },
    reward: { coin: 20, exp: 30 },
    condition: (state) => state.totalNewsRead >= 5,
  },

  {
    id: "NEWS_10",
    tier: "RARE",
    badge: {
      title: "경제 기자",
      description: "뉴스를 10개 읽었어요!",
      emoji: "🗞️",
    },
    reward: { coin: 40, exp: 50 },
    condition: (state) => state.totalNewsRead >= 10,
  },

  {
    id: "NEWS_20",
    tier: "RARE",
    badge: {
      title: "시장 관찰자",
      description: "뉴스를 20개 읽었어요!",
      emoji: "🔎",
    },
    reward: { coin: 60, exp: 70 },
    condition: (state) => state.totalNewsRead >= 20,
  },

  {
    id: "NEWS_30",
    tier: "LEGEND",
    badge: {
      title: "경제 마스터",
      description: "경제 흐름을 잘 이해하고 있어요!",
      emoji: "📡",
    },
    reward: { coin: 90, exp: 100, score: 15 },
    condition: (state) => state.totalNewsRead >= 30,
  },

  // ===============================
  // ⭐ 레벨 업적
  // ===============================

  {
    id: "LEVEL_5",
    tier: "COMMON",
    badge: {
      title: "레벨 5 달성",
      description: "경제 흐름을 점점 잘 이해하고 있어요!",
      emoji: "✨",
    },
    reward: { coin: 60, exp: 80 },
    condition: (state) => state.level >= 5,
  },

  {
    id: "LEVEL_10",
    tier: "LEGEND",
    badge: {
      title: "경제 마스터",
      description: "최고 레벨 달성! 정말 대단해요!",
      emoji: "🏵️",
    },
    reward: { coin: 200, exp: 150, score: 30 },
    condition: (state) => state.level >= 10,
  },

  // ===============================
  // 🔥 출석 업적
  // ===============================

  {
    id: "ATTEND_3_DAYS",
    tier: "COMMON",
    badge: {
      title: "3일 연속 출석",
      description: "3일 연속으로 찾아왔어요!",
      emoji: "📅",
    },
    reward: { coin: 20, exp: 20 },
    condition: (state) => state.streak >= 3,
  },

  {
    id: "ATTEND_7_DAYS",
    tier: "COMMON",
    badge: {
      title: "일주일 개근",
      description: "7일 연속 출석 성공!",
      emoji: "🔥",
    },
    reward: { coin: 50, exp: 40 },
    condition: (state) => state.streak >= 7,
  },

  {
    id: "ATTEND_14_DAYS",
    tier: "RARE",
    badge: {
      title: "꾸준한 탐험가",
      description: "14일 연속 출석했어요!",
      emoji: "⏰",
    },
    reward: { coin: 80, exp: 60 },
    condition: (state) => state.streak >= 14,
  },

  {
    id: "ATTEND_30_DAYS",
    tier: "RARE",
    badge: {
      title: "한 달 개근",
      description: "30일 연속 출석 성공!",
      emoji: "🏠",
    },
    reward: { coin: 150, exp: 100 },
    condition: (state) => state.streak >= 30,
  },

  {
    id: "ATTEND_100_DAYS",
    tier: "LEGEND",
    badge: {
      title: "출석 마스터",
      description: "엄청난 꾸준함을 보여주고 있어요!",
      emoji: "🌟",
    },
    reward: { coin: 300, exp: 200, score: 30 },
    condition: (state) => state.streak >= 100,
  },

  {
    id: "ATTEND_365_DAYS",
    tier: "LEGEND",
    badge: {
      title: "1년 개근왕",
      description: "365일 연속 출석! 정말 대단해요!",
      emoji: "🎖️",
    },
    reward: { coin: 500, exp: 300, score: 50 },
    condition: (state) => state.streak >= 365,
  },
];
