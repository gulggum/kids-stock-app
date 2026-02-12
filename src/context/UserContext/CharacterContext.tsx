//캐릭터 성장관련(경험치등..)

import { createContext, useContext, useEffect, useState } from "react";
import { LEVEL_RULES } from "../../data/rules/levelTitles";

//캐릭터의 현재상태(레벨,경험치)
type CharacterState = {
  level: number;
  exp: number; //누적 경험치(총합)
};

//context에서 외부로 제공할 값들
type CharacterContextType = {
  character: CharacterState;
  addExp: (amount: number) => void; //경험치 추가 함수
  currentTitle: string;
};

const CharacterContext = createContext<CharacterContextType>(
  {} as CharacterContextType,
);

const CHARACTER_KEY = "character_state"; //캐릭터 상태를 저장한 로컬스토리지 키

/**
 * 🔥 현재 경험치 기준으로 레벨 계산
 * LEVEL_RULES를 기반으로 현재 레벨 반환
 */
const getLevelFromExp = (exp: number) => {
  return (
    LEVEL_RULES.slice()
      .reverse()
      .find((rule) => exp >= rule.requiredExp)?.level || 1
  );
};

/**
 * 🔥 현재 경험치 기준으로 칭호 계산
 */
const getTitleFromExp = (exp: number) => {
  return (
    LEVEL_RULES.slice()
      .reverse()
      .find((rule) => exp >= rule.requiredExp)?.title || "🐣 투자 새싹"
  );
};

export const CharacterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [character, setCharacter] = useState<CharacterState>(() => {
    const saved = localStorage.getItem(CHARACTER_KEY);

    // 저장된 값이 없거나 잘못된 경우 기본값
    if (!saved || saved === "undefined") {
      return { level: 1, exp: 0 };
    }

    return JSON.parse(saved);
  });

  /**
   * 🔥 경험치 추가 함수
   * - 누적 경험치 증가
   * - LEVEL_RULES 기반으로 레벨 자동 계산
   */
  const addExp = (amount: number) => {
    setCharacter((prev) => {
      const newExp = prev.exp + amount;
      const newLevel = getLevelFromExp(newExp);

      return {
        level: newLevel,
        exp: newExp,
      };
    });
  };

  // 🔹 칭호 자동 계산 (현재 경험치 기준)
  const currentTitle = getTitleFromExp(character.exp);

  // 🔹 상태 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem(CHARACTER_KEY, JSON.stringify(character));
  }, [character]);

  return (
    <CharacterContext.Provider value={{ character, addExp, currentTitle }}>
      {children}
    </CharacterContext.Provider>
  );
};

/**
 * CharacterContext를 쉽게 쓰기 위한 커스텀 훅
 */
export const useCharacter = () => {
  const context = useContext(CharacterContext);

  if (!context) {
    throw new Error("useCharacter must be used within CharacterProvider");
  }

  return context;
};
