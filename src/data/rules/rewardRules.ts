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
  READ_NEWS: { coin: 5, exp: 8 },

  // 📘 퀴즈
  QUIZ_CORRECT: { coin: 8, exp: 20, score: 3 },
  QUIZ_STREAK_3: { coin: 15, exp: 40, score: 10 },

  // 📅 출석
  ATTENDANCE_DAILY: { coin: 30, exp: 15, score: 1 },
  ATTENDANCE_STREAK_7: { coin: 70, exp: 50 },

  // 💡 오늘의 지식 확인
  DAILY_KNOWLEDGE: { coin: 15, exp: 20 },

  // 📈 투자 행동
  FIRST_INVEST: { coin: 30, exp: 40, score: 5 },
  BUY_STOCK: { coin: 5, exp: 10, score: 2 },
  SELL_STOCK: { coin: 5, exp: 10 },

  // 📉 실패도 경험
  FIRST_LOSS: { exp: 30 },
  BANKRUPT: { exp: 100 },

  // 🎒 소비
  ITEM_PURCHASE: { exp: 20 },

  // 광고 보기
  AD_WATCH: { coin: 30, exp: 0 },

  // 🏆 레벨업은 ExpBarCard컴포넌트 에서 코인 차등 지급함
} satisfies Record<string, RewardRule>;

export type RewardType = keyof typeof REWARD_RULES;
