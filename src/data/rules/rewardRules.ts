/**
 * 🎁 키즈스톡 보상 규칙
 * - 언제 코인/경험치/점수를 주는지 정의
 * - 컴포넌트에서는 "얼마 줄지" 고민하지 않는다
 */

export const COIN_REWARD = {
  QUIZ_CORRECT: 1, // 퀴즈 최초 정답
  ATTENDANCE: 1, // 하루 출석
};

export const EXP_REWARD = {
  FIRST_INVEST: 20, // 첫 투자
  QUIZ_CORRECT: 10, // 퀴즈 최초 정답
  ITEM_PURCHASE: 10, // 아이템 구매
};

export const SCORE_REWARD = {
  QUIZ: 2, // 오늘 첫 퀴즈
  INVEST: 3, // 오늘 첫 투자
};
