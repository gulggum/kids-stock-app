// RewardContext.tsx
// ------------------------------------------------------
// 중앙 보상 관리 Context

/**
 * 📦 RewardContext
 *
 * 역할: 보상 지급의 단일 창구
 * - 컴포넌트가 직접 addCoin/addScore/addExp를 호출하지 않도록 한다
 * - 보상 수치는 rewardRules.ts에서만 관리 (이 파일은 "실행"만 담당)
 *
 * ✅ STEP 1 리팩토링
 * - 기존: useCoin + useScore + useCharacter 세 Context를 각각 참조
 * - 변경: useUser 하나로 통합 (coin, score, exp 모두 user 안에 있음)
 */

import { createContext, useContext } from "react";
import {
  REWARD_RULES,
  type RewardType,
  type RewardRule,
} from "../data/rules/rewardRules";
import { useUser } from "./UserContext/UserContext";
import type { ReactNode } from "react";

// ─────────────────────────────────────────
// 📌 타입 정의
// ─────────────────────────────────────────

type RewardContextType = {
  /** rewardRules에 정의된 키로 보상 지급 (ex. "QUIZ_CORRECT") */
  giveReward: (rewardType: RewardType) => void;

  /** 업적처럼 직접 reward 객체를 넘길 때 사용 */
  giveCustomReward: (reward: RewardRule) => void;
};

// ─────────────────────────────────────────
// 📌 Context 생성
// ─────────────────────────────────────────

const RewardContext = createContext<RewardContextType | null>(null);

// ─────────────────────────────────────────
// 📌 Provider
// ─────────────────────────────────────────

export const RewardProvider = ({ children }: { children: ReactNode }) => {
  // ✅ 기존의 useCoin + useScore + useCharacter를 useUser 하나로 대체
  // UserContext가 coin, score, exp를 모두 가지고 있음
  const { addCoin, addScore, addExp } = useUser();

  /**
   * rewardRules.ts의 키값으로 보상 지급
   * 정의되지 않은 키면 조용히 무시 (방어 코드)
   */
  const giveReward = (rewardType: RewardType) => {
    const rule = REWARD_RULES[rewardType];
    if (!rule) return;
    applyReward(rule);
  };

  /**
   * 업적 등 커스텀 보상 지급
   * reward 객체를 직접 넘겨서 처리
   */
  const giveCustomReward = (reward: RewardRule) => {
    applyReward(reward);
  };

  /**
   * 실제 보상 실행 (내부 전용)
   * undefined 체크로 0도 정상 처리됨
   */
  const applyReward = (reward: RewardRule) => {
    if (reward.coin !== undefined) addCoin(reward.coin);
    if (reward.score !== undefined) addScore(reward.score);
    if (reward.exp !== undefined) addExp(reward.exp);
  };

  return (
    <RewardContext.Provider value={{ giveReward, giveCustomReward }}>
      {children}
    </RewardContext.Provider>
  );
};

// ─────────────────────────────────────────
// 📌 커스텀 훅
// ─────────────────────────────────────────

export const useReward = () => {
  const context = useContext(RewardContext);

  // Provider 밖에서 쓰면 명확한 에러 메시지로 알려줌
  if (!context) {
    throw new Error("useReward must be used within RewardProvider");
  }

  return context;
};
