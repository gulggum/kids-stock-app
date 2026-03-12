/**
 * 📅 출석 관련 규칙
 * - 연속 출석 일수 기준
 * - days 도달 시 해당 badgeId 지급
 */

export const ATTENDANCE_BADGE_RULES = [
  { days: 7, badgeId: "ATTEND_7_DAYS" },
  { days: 30, badgeId: "ATTEND_30_DAYS" },
  { days: 365, badgeId: "ATTEND_365_DAYS" },
];

export const ATTENDANCE_REWARD = {
  DAILY_COIN: 20,
  WEEK_BONUS: 50,
};
