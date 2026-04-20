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

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ACHIEVEMENTS } from "../data/rules/achievementRules";
import { useReward } from "./RewardContext";
import { useTrade } from "./TradeContext";
import { usePortfolio } from "./PortfolioContext";
import { useUser } from "./UserContext";
import type { ReactNode } from "react";

type AchievementContextType = {
  achieved: string[]; // 달성한 업적 ID 목록 (= user.achievements)
  popupAchievement: string | null; // 현재 팝업으로 보여줄 업적 ID (없으면 null)
  closePopupAchievement: () => void;
};

const AchievementContext = createContext<AchievementContextType>(
  {} as AchievementContextType,
);

export const AchievementProvider = ({ children }: { children: ReactNode }) => {
  // ✅ 업적 달성 팝업 상태
  const [popupAchievement, setPopupAchievement] = useState<string | null>(null);

  // → 거래 목록 (trades.length로 총 거래 횟수 계산)
  const { trades } = useTrade();
  // → 현재 총 자산 (현금 + 주식 평가액)
  const { totalAsset } = usePortfolio();
  // → 보상 지급 함수
  const { giveCustomReward } = useReward();
  // → 유저 정보 + 업적 추가 함수(  //  user.achievements를 단일 출처로 사용)
  const { user, addAchievement } = useUser();

  const closePopupAchievement = () => setPopupAchievement(null);

  // totalLoss 계산 - trades에서 직접
  const totalLoss = useMemo(() => {
    return trades
      .filter((t) => t.type === "SELL")
      .filter((sell) => {
        // 같은 종목의 BUY 거래만 추출
        const buyTrades = trades.filter(
          (t) => t.type === "BUY" && t.stockId === sell.stockId,
        );
        if (!buyTrades.length) return false;

        // 평균 매수가 계산
        const avgBuyPrice =
          buyTrades.reduce((sum, t) => sum + t.price, 0) / buyTrades.length;

        // 판매가 < 평균매수가 → 손실
        return sell.price < avgBuyPrice;
      }).length;
  }, [trades]);

  // 🔍  핵심 로직: 업적 조건 자동 감시
  // → useEffect의 의존성 배열 [trades, totalAsset, user.level, user.streak]이
  //   변경될 때마다 아래 코드가 자동으로 실행됨
  useEffect(() => {
    // 📊 현재 유저 상태를 하나의 객체로 묶기
    // → achievementRules의 condition 함수에 넘겨줄 인자
    // → 여기에 새로운 상태 추가 시 AchievementState 타입도 함께 수정해야 함
    const state = {
      totalTrades: trades.filter((t) => t.type === "BUY").length, // 구매만
      totalSells: trades.filter((t) => t.type === "SELL").length, // 판매만
      totalAsset,
      level: user.level,
      streak: user.streak,
      totalQuizCorrect: user.quizProgress.length,
      totalLoss,
      hasBankrupt: user.hasBankrupt,
      totalKnowledge: user.totalKnowledge ?? 0,
      uniqueStocks: [
        ...new Set(
          trades.filter((t) => t.type === "BUY").map((t) => t.stockId),
        ),
      ].length,
      totalNewsRead: 0,
    };

    // 🔍 전체 업적을 순회하며 달성 조건 체크
    ACHIEVEMENTS.forEach((achievement) => {
      // ✅ 이미 달성한 업적은 건너뜀 (중복 보상 방지)
      // → user.achievements 배열에 이미 id가 있으면 skip
      if (user.achievements.includes(achievement.id)) return;

      // ✅ 조건 함수 실행
      // → achievementRules에 정의된 condition(state) => boolean 실행
      // → true면 지금 막 조건 달성한 것
      if (achievement.condition(state)) {
        // 🎁 1. 보상 지급 (코인 / exp / score)
        giveCustomReward(achievement.reward);

        // 💾 2. 달성 업적 저장
        // → UserContext의 addAchievement가 localStorage까지 처리
        addAchievement(achievement.id);

        // 🎉 3. 팝업 표시
        // → 마지막으로 달성한 업적 1개만 팝업으로 보여줌
        setPopupAchievement(achievement.id);
      }
    });

    // 📌 의존성 배열: 이 값들이 바뀔 때만 위 로직 재실행
    // → 새로운 state 항목 추가 시 여기도 반드시 추가해야 함
  }, [
    trades,
    totalAsset,
    user.level,
    user.streak,
    user.quizProgress,
    user.hasBankrupt,
    user.totalKnowledge,
  ]);

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
