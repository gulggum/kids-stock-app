//캐릭터 성장관련(경험치등..)

import { createContext, useContext, useEffect, useState } from "react";

//캐릭터의 현재상태(레벨,경험치)
type CharacterState = {
  level: number;
  exp: number;
};

//context에서 외부로 제공할 값들
type CharacterContextType = {
  character: CharacterState;
  addExp: (amount: number) => void; //경험치 추가 함수
};

const CharacterContext = createContext<CharacterContextType>(
  {} as CharacterContextType,
);

const CHARACTER_KEY = "character_state"; //캐릭터 상태를 저장한 로컬스토리지 키

//캐릭터 상태 * 처음 한 번만 localStorage에서 불러옴
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

  // 경험치를 추가하는 함수  * 경험치가 100 이상이면 레벨업 처리
  const addExp = (amount: number) => {
    setCharacter((prev) => {
      const nextExp = prev.exp + amount;

      // 레벨업 조건
      if (nextExp >= 100) {
        return {
          level: prev.level + 1,
          exp: nextExp - 100, // 남은 경험치
        };
      }

      return {
        ...prev,
        exp: nextExp,
      };
    });
  };
  // character 상태가 바뀔 때마다 localStorage에 저장 (새로고침해도 레벨/경험치 유지)
  useEffect(() => {
    localStorage.setItem(CHARACTER_KEY, JSON.stringify(character));
  }, [character]);

  return (
    <CharacterContext.Provider value={{ character, addExp }}>
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
