/**
 * 📌 레벨 메타 정보 계산
 * - 레벨 숫자 기반으로
 *   1. 타이틀
 *   2. 카드 등급(tier)
 *   반환
 *
 * 레벨 = 종합 활동 지표
 * 업적과는 별개
 */

import { LEVEL_RULES } from "../data/rules/levelTitles";

export type LevelTier = "COMMON" | "RARE" | "LEGEND";

export const getLevelTier = (level: number) => {
  // 1️⃣ 타이틀 계산
  const title =
    LEVEL_RULES.slice()
      .reverse()
      .find((rule) => level >= rule.level)?.title ?? "🐣 투자 새싹";

  // 2️⃣ 등급 계산 (카드 색 기준)
  let tier: LevelTier = "COMMON";

  if (level >= 15) tier = "LEGEND";
  else if (level >= 8) tier = "RARE";

  return { title, tier };
};

//경험치별 locked 함수
export const isCardUnlocked = (userLevel: number, unlockLevel?: number) => {
  return userLevel >= (unlockLevel ?? 0);
};
