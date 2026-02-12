// RewardContext.tsx
// ------------------------------------------------------
// 중앙 보상 관리 Context
//
// 역할:
// 1. rewardRules를 기반으로 보상 지급
// 2. Coin, Score, Character(Exp)를 통합 제어
// 3. 컴포넌트는 addCoin 등을 직접 호출하지 않도록 한다
//
// 유지보수 원칙:
// - 보상 수치는 rewardRules.ts에서만 관리
// - 이 파일에서는 "보상 실행"만 담당
// ------------------------------------------------------

import { createContext, useContext } from "react";
import { REWARD_RULES, type RewardType } from "../data/rules/rewardRules";

// 기존 Context들 import
import { useCoin } from "./WalletContext/CoinContext";
import { useScore } from "./ScoreContext";
import { useCharacter } from "./UserContext/CharacterContext";
import type { ReactNode } from "react";

type RewardContextType = {
  giveReward: (rewardType: RewardType) => void;
};

const RewardContext = createContext<RewardContextType | null>(null);

export const RewardProvider = ({ children }: { children: ReactNode }) => {
  // 각 Context에서 필요한 함수만 가져온다
  const { addCoin } = useCoin();
  const { addScore } = useScore();
  const { addExp } = useCharacter();

  /**
   * giveReward
   * @param rewardType - rewardRules에 정의된 키값
   *
   * 사용 예시:
   * giveReward("FIRST_BUY_REWARD");
   */
  const giveReward = (rewardType: RewardType) => {
    const rule = REWARD_RULES[rewardType];

    // 정의되지 않은 보상 방어 코드
    if (!rule) return;

    // 각 자원별 보상 실행
    if (rule.coin !== undefined) {
      addCoin(rule.coin);
    }

    if (rule.score !== undefined) {
      addScore(rule.score);
    }

    if (rule.exp !== undefined) {
      addExp(rule.exp);
    }

    // 향후 확장 가능:
    // if (rule.money) addMoney(rule.money);
  };

  return (
    <RewardContext.Provider value={{ giveReward }}>
      {children}
    </RewardContext.Provider>
  );
};

// 커스텀 훅
export const useReward = () => {
  const context = useContext(RewardContext);

  if (!context) {
    throw new Error("useReward must be used within RewardProvider");
  }

  return context;
};
