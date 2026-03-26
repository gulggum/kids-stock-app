/**
 * 📦 AchievementContext
 *
 * 역할: 업적 조건 감시 및 보상 지급
 * - 주식/게임 상태 변화를 감지
 * - 업적 조건 충족 시 RewardContext를 통해 보상 지급
 *
 * 의존성
 * - TradeContext   : 거래 횟수 감지
 * - PortfolioContext: 총자산 감지
 * - RewardContext  : 보상 지급
 * - useUser        : 업적 저장 (user.achievements)
 */

import { createContext, useContext, useEffect, useState } from "react";
import { ACHIEVEMENTS } from "../data/rules/achievementRules";
import { useReward } from "./RewardContext";
import { useTrade } from "./TradeContext";
import { usePortfolio } from "./PortfolioContext";
import { useUser } from "./UserContext";
import type { ReactNode } from "react";

type AchievementContextType = {
  achieved: string[]; // 달성한 업적 ID 목록 (= user.achievements)
  popupAchievement: string | null; // 현재 팝업 표시 중인 업적
  closePopupAchievement: () => void;
};

const AchievementContext = createContext<AchievementContextType>(
  {} as AchievementContextType,
);

export const AchievementProvider = ({ children }: { children: ReactNode }) => {
  const { trades } = useTrade();
  const { totalAsset } = usePortfolio();
  const { giveCustomReward } = useReward();
  // ✅ user.achievements를 단일 출처로 사용
  const { user, addAchievement } = useUser();

  const [popupAchievement, setPopupAchievement] = useState<string | null>(null);

  const closePopupAchievement = () => setPopupAchievement(null);

  // 🔍 업적 조건 감시
  useEffect(() => {
    const state = {
      totalTrades: trades.length,
      totalAsset,
      level: user.level,
      streak: user.streak,
    };

    ACHIEVEMENTS.forEach((achievement) => {
      // ✅  user.achievements로 중복 체크
      if (user.achievements.includes(achievement.id)) return;

      if (achievement.condition(state)) {
        // 🎁 보상 지급
        giveCustomReward(achievement.reward);

        // ✅ UserContext의 addAchievement로 저장 (localStorage는 UserContext가 담당)
        addAchievement(achievement.id);

        // 🎉 팝업 표시
        setPopupAchievement(achievement.id);
      }
    });
  }, [trades, totalAsset, user.level, user.streak]);

  return (
    <AchievementContext.Provider
      value={{
        // ✅ user.achievements를 그대로 노출
        achieved: user.achievements,
        popupAchievement,
        closePopupAchievement,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievement = () => useContext(AchievementContext);
