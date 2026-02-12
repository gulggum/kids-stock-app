/**
 * 🎖 키즈스톡 레벨 시스템 (MVP 1차 버전)
 * - 현재는 1~5 레벨까지만 운영
 * - 추후 시즌제 도입 시 확장 가능
 */

export const LEVEL_RULES = [
  {
    level: 1,
    requiredExp: 0,
    title: "🐣 투자 새싹",
  },
  {
    level: 2,
    requiredExp: 100,
    title: "🌱 배우는 투자자",
  },
  {
    level: 3,
    requiredExp: 300,
    title: "🐥 도전하는 투자자",
  },
  {
    level: 4,
    requiredExp: 700,
    title: "🦊 똑똑한 투자자",
  },
  {
    level: 5,
    requiredExp: 1500,
    title: "🦁 당당한 투자 고수",
  },
];
