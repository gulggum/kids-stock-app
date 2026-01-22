// 뱃지context

import { createContext, useContext, useEffect, useState } from "react";
import type { BadgeId } from "../data/bades";

type BadgeContextType = {
  earnedBadges: BadgeId[]; //획득한 뱃지 목록
  earnBadge: (badgeId: BadgeId) => void; //뱃지 획득
  hasBadge: (badgeId: BadgeId) => boolean; //이미 획득여부
  popupBadge: BadgeId | null;
};

const BadgeContext = createContext<BadgeContextType>({} as BadgeContextType);

const BADGE_KEY = "earned_badges";

export const BadgeProvider = ({ children }: { children: React.ReactNode }) => {
  //획득 뱃지 (localStorage 유지)
  const [earnedBadges, setEarnedBadges] = useState<BadgeId[]>(() => {
    const saved = localStorage.getItem(BADGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [popupBadge, setPopupBadge] = useState<BadgeId | null>(null);

  //뱃지 획득 처리
  const earnBadge = (id: BadgeId) => {
    setEarnedBadges((prev) => {
      if (prev.includes(id)) return prev; //중복 방지

      //뱃지 팝업 표시 및 자동 닫기
      setPopupBadge(id);
      setTimeout(() => setPopupBadge(null), 2000);

      return [...prev, id];
    });
  };
  //이미 획득했는지 확인
  const hasBadge = (id: BadgeId) => earnedBadges.includes(id);

  //상태 변경시 localStorage 저장
  useEffect(() => {
    localStorage.setItem(BADGE_KEY, JSON.stringify(earnedBadges));
  }, [earnedBadges]);

  return (
    <BadgeContext.Provider
      value={{ earnedBadges, earnBadge, hasBadge, popupBadge }}
    >
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) throw new Error("useBadge must be used within BadgeProvider");
  return context;
};
