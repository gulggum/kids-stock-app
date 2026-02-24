//업적 최고 등급 계산 전용

import { ACHIEVEMENTS } from "../data/rules/achievementRules";

export const getHighestAchievementTier = (badgeIds: string[]) => {
  const tierPriority = {
    LEGEND: 3,
    RARE: 2,
    COMMON: 1,
  };

  const achievements = badgeIds
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean);

  if (achievements.length === 0) return "COMMON";

  return achievements.sort(
    (a, b) => tierPriority[b!.tier] - tierPriority[a!.tier],
  )[0]!.tier;
};
