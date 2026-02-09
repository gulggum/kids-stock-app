/**
 * 🚫 중복 보상 방지 기준
 * - "한 번만 보상해야 하는 행동" 정의
 */

export const ONE_TIME_ACTION = {
  QUIZ: "QUIZ", // 퀴즈는 1회만
  ITEM_PURCHASE: "ITEM_PURCHASE",
};

export const DAILY_ACTION = {
  QUIZ: "DAILY_QUIZ", // 하루 1회만
  INVEST: "DAILY_INVEST",
};
