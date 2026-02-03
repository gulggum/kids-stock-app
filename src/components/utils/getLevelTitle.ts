// 레벨 → 칭호 계산 함수

import { LEVEL_TITLES } from "../../data/levelTitles";

/**
 * 현재 레벨에 맞는 칭호 반환
 */
export const getLevelTitle = (level: number) => {
  return (
    LEVEL_TITLES.slice() // 원본 보호
      .reverse() // 높은 레벨부터 검사
      .find((item) => level >= item.minLevel)?.title ?? "🐣 투자 새싹"
  );
};
