/**
🔥 키즈스톡 레벨 시스템 (MVP 1차 버전)
 * - 현재는 1~5 레벨까지만 운영
 * - 추후 시즌제 도입 시 확장 가능
 * 
🔥 레벨 성장 규칙
 * - exp 기준으로 레벨 결정
 * - 레벨은 유저의 종합 활동 지표

🔥 레벨기준
- level 1 ~ 2 → COMMON (초반 적응 구간)
- level 3 ~ 4 → RARE (꾸준히 한 유저)
- level 5 이상 → LEGEND (현재 최고 레벨 → 레전드)
 */

export const LEVEL_RULES = [
  {
    level: 1,
    requiredExp: 0,
    title: "🐣 투자 새싹",
    tier: "COMMON",
  },
  {
    level: 2,
    requiredExp: 100,
    title: "🌱 배우는 투자자",
    tier: "COMMON",
  },
  {
    level: 3,
    requiredExp: 300,
    title: "🐥 도전하는 투자자",
    tier: "COMMON",
  },
  {
    level: 4,
    requiredExp: 700,
    title: "🦊 똑똑한 투자자",
    tier: "RARE",
  },
  {
    level: 5,
    requiredExp: 1500,
    title: "🦁 당당한 투자 고수",
    tier: "LEGEND",
  },
];
