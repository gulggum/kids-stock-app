//---행동 즉시 보상------
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

export const REWARD_RULES = {
  // 📅 뉴스 확인
  READ_NEWS: { coin: 3, exp: 5 },

  // 📘 퀴즈
  QUIZ_CORRECT: { coin: 5, exp: 15, score: 3 },
  QUIZ_STREAK_3: { coin: 10, exp: 30, score: 10 },

  // 📅 출석
  ATTENDANCE_DAILY: { coin: 20, exp: 10, score: 1 },
  ATTENDANCE_STREAK_7: { coin: 50, exp: 40 },

  // 💡 오늘의 지식 확인
  DAILY_KNOWLEDGE: { coin: 3, exp: 10 },

  // 📈 투자 행동
  FIRST_INVEST: { coin: 30, exp: 40, score: 5 },
  BUY_STOCK: { coin: 5, exp: 10, score: 2 },
  SELL_STOCK: { coin: 5, exp: 10 },

  // 📉 실패도 경험
  FIRST_LOSS: { exp: 30 },
  BANKRUPT: { exp: 100 },

  // 🎒 소비
  ITEM_PURCHASE: { exp: 20 },

  // 🏆 레벨업
  LEVEL_UP: { coin: 30 },
} satisfies Record<string, RewardRule>;

export type RewardType = keyof typeof REWARD_RULES;
