//뱃지 정의

// 뱃지 ID 타입
export type BadgeId =
  | "FIRST_BUY"
  | "DAILY_ONCE"
  | "WEEK_3"
  | "LEVEL_10"
  | "QUIZ_MASTER";

// 뱃지 메타 정보 (설명용)
export const BADGES: Record<
  BadgeId,
  { title: string; description: string; emoji: string }
> = {
  FIRST_BUY: {
    title: "첫 투자",
    description: "처음으로 주식을 샀어요!",
    emoji: "🎉",
  },
  DAILY_ONCE: {
    title: "오늘의 한 번",
    description: "오늘 첫 투자를 완료했어요",
    emoji: "📅",
  },
  WEEK_3: {
    title: "연속 세 번",
    description: "연속으로 세 번의 투자를 완료했어요",
    emoji: "🔥",
  },

  LEVEL_10: {
    title: "레벨 10 달성",
    description: "어느새 투자 레벨이 10이 되었어요!",
    emoji: "⭐",
  },

  QUIZ_MASTER: {
    title: "퀴즈 박사",
    description: "뉴스 퀴즈를 여러 번 맞혔어요!",
    emoji: "🧠",
  },
};
