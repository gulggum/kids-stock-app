/**
 * 🎁 키즈스톡 통합 보상 규칙
 * - 이벤트 기준으로 보상 정의
 * - RewardContext에서 이 객체만 참조
 */

export type RewardRule = {
  coin?: number;
  exp?: number;
  score?: number;
  money?: number;
};

export const REWARD_RULES: Record<string, RewardRule> = {
  // ----------------------
  // 📘 퀴즈
  // ----------------------
  QUIZ_CORRECT: {
    coin: 1,
    exp: 10,
    score: 3,
  },

  QUIZ_STREAK_3: {
    coin: 3,
    exp: 20,
    score: 10,
  },

  // ----------------------
  // 📅 출석
  // ----------------------
  ATTENDANCE_DAILY: {
    coin: 1,
    exp: 5,
    score: 1,
  },

  ATTENDANCE_STREAK_7: {
    coin: 5,
    exp: 30,
  },

  // ----------------------
  // 📈 투자 행동
  // ----------------------
  FIRST_INVEST: {
    exp: 30,
    score: 5,
  },

  BUY_STOCK: {
    exp: 5,
    score: 2,
  },

  SELL_STOCK: {
    exp: 5,
  },

  TRADE_10: {
    coin: 5,
    exp: 40,
  },

  // ----------------------
  // 💰 수익 관련
  // ----------------------
  PROFIT_5_PERCENT: {
    coin: 3,
    exp: 30,
    score: 20,
  },

  PROFIT_10_PERCENT: {
    coin: 10,
    exp: 70,
    score: 50,
  },

  ASSET_120: {
    coin: 5,
    exp: 40,
  },

  ASSET_150: {
    coin: 15,
    exp: 100,
  },

  // ----------------------
  // 📉 실패도 보상
  // ----------------------
  FIRST_LOSS: {
    exp: 20,
  },

  BANKRUPT: {
    exp: 80,
  },

  // ----------------------
  // 🎒 소비
  // ----------------------
  ITEM_PURCHASE: {
    exp: 15,
  },

  // ----------------------
  // 🏆 레벨업
  // ----------------------
  LEVEL_UP: {
    coin: 5,
  },
} satisfies Record<string, RewardRule>;

/**
 * 🔥 RewardType 자동 추론
 * "QUIZ_CORRECT" | "ATTENDANCE_DAILY" | ...
 */
export type RewardType = keyof typeof REWARD_RULES; //오타방지
