//뱃지 정의

// 뱃지 ID 타입
export type BadgeId = "FIRST_BUY" | "DAILY_ONCE";

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
};
