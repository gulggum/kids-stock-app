//언제 보상을 줄지 판단하는 감시자

import { createContext, useContext, useEffect, useState } from "react";
import { ACHIEVEMENTS } from "../../data/rules/achievementRules";
import { useReward } from "../RewardContext";
import { useTrade } from "../TradeContext";
import { usePortfolio } from "../PortfolioContext";
import { useCharacter } from "../UserContext/CharacterContext";
import type { ReactNode } from "react";
import { useAttendance } from "../AttendanceContext";

type AchievementContextType = {
  achieved: string[]; // 달성한 업적 ID 목록
  popupAchievement: string | null; // 현재 팝업 표시 중인 업적
  closePopupAchievement: () => void; // 팝업 닫기
};

const AchievementContext = createContext<AchievementContextType>(
  {} as AchievementContextType,
);

export const AchievementProvider = ({ children }: { children: ReactNode }) => {
  const { trades } = useTrade();
  const { totalAsset } = usePortfolio();
  const { character } = useCharacter();
  const { giveCustomReward } = useReward();
  const { streak } = useAttendance();

  const [achieved, setAchieved] = useState<string[]>(() => {
    const saved = localStorage.getItem("achievements");
    return saved ? JSON.parse(saved) : [];
  });

  // 업적 달성 팝업 상태
  const [popupAchievement, setPopupAchievement] = useState<string | null>(null);
  //  팝업 닫기 함수
  const closePopupAchievement = () => {
    setPopupAchievement(null);
  };
  useEffect(() => {
    const state = {
      totalTrades: trades.length,
      totalAsset,
      level: character.level,
      streak,
    };

    ACHIEVEMENTS.forEach((achievement) => {
      setAchieved((prev) => {
        // 이미 달성했으면 스킵
        if (prev.includes(achievement.id)) return prev;

        // 조건 만족하면
        if (achievement.condition(state)) {
          // 🎁 보상 지급
          giveCustomReward(achievement.reward);

          // 🎉 팝업 표시
          setPopupAchievement(achievement.id);

          return [...prev, achievement.id];
        }

        return prev;
      });
    });
  }, [trades, totalAsset, character.level, streak]);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achieved));
  }, [achieved]);

  return (
    <AchievementContext.Provider
      value={{ achieved, popupAchievement, closePopupAchievement }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievement = () => useContext(AchievementContext);
