/**
 * 📌 getLevelTier
 *
 * 역할: 레벨 숫자 기반으로 타이틀 + 티어 반환
 * - 타이틀, 티어 기준은 levelTitles.ts 한 곳에서만 관리
 * - 이 파일에서 하드코딩 없음 → levelTitles 바꾸면 자동 반영
 *
 * ✅ 기존 하드코딩 제거
 * - 기존: if (level >= 15) tier = "LEGEND" 직접 계산
 * - 변경: LEVEL_RULES에서 tier 직접 읽음
 */

import { LEVEL_RULES } from "../data/rules/levelTitles";
import type { LevelTier } from "../data/rules/levelTitles";

// LevelTier 외부에서도 쓸 수 있게 재export
export type { LevelTier };

/**
 * 레벨 기반으로 타이틀 + 티어 반환
 * ex) getLevelTier(7) → { title: "🦅 날카로운 투자자", tier: "EPIC" }
 */
export const getLevelTier = (level: number) => {
  // 현재 레벨에 해당하는 룰 찾기 (내림차순으로 찾아서 가장 높은 레벨 매칭)
  const rule =
    LEVEL_RULES.slice()
      .reverse()
      .find((r) => level >= r.level) ?? LEVEL_RULES[0];

  return {
    title: rule.title,
    tier: rule.tier,
  };
};

/**
 * 카드 잠금 해제 여부
 * - unlockLevel 없으면 누구나 사용 가능
 * ex) isCardUnlocked(10, 10) → true
 * ex) isCardUnlocked(5, 10)  → false
 */
export const isCardUnlocked = (userLevel: number, unlockLevel?: number) => {
  return userLevel >= (unlockLevel ?? 0);
};
