/**
 * 🎮 키즈스톡 레벨 시스템
 *
 * - 경험치(exp) 기준으로 레벨 결정
 * - 레벨은 유저의 종합 활동 지표 (업적과 별개)
 *
 * 티어 기준
 * - level 1 ~ 3  → COMMON  (초반 적응 구간)
 * - level 4 ~ 6  → RARE    (꾸준히 활동한 유저)
 * - level 7 ~ 8  → EPIC    (열심히 하는 유저)
 * - level 9 ~ 10 → LEGEND  (레전드 카드 언락 구간)
 *
 * TODO: 추후 시즌제 도입 시 레벨 확장 예정
 */

export type LevelTier = "COMMON" | "RARE" | "EPIC" | "LEGEND";

export type LevelRule = {
  level: number;
  requiredExp: number;
  title: string;
  tier: LevelTier;
};

export const LEVEL_RULES: LevelRule[] = [
  { level: 1, requiredExp: 0, title: "🐣 투자 새싹", tier: "COMMON" },
  { level: 2, requiredExp: 50, title: "🌱 배우는 투자자", tier: "COMMON" },
  { level: 3, requiredExp: 150, title: "🐥 도전하는 투자자", tier: "COMMON" },
  { level: 4, requiredExp: 300, title: "🦊 똑똑한 투자자", tier: "RARE" },
  { level: 5, requiredExp: 600, title: "🐯 용감한 투자자", tier: "RARE" },
  { level: 6, requiredExp: 1000, title: "🦁 자신있는 투자자", tier: "RARE" },
  { level: 7, requiredExp: 1500, title: "🦅 날카로운 투자자", tier: "EPIC" },
  { level: 8, requiredExp: 2200, title: "🌟 빛나는 투자자", tier: "EPIC" },
  { level: 9, requiredExp: 3000, title: "💎 다이아 투자자", tier: "LEGEND" },
  { level: 10, requiredExp: 4000, title: "👑 투자 마스터", tier: "LEGEND" },
];
