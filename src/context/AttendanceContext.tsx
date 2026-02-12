import { createContext, useContext, useEffect, useState } from "react";
import { useCoin } from "./WalletContext/CoinContext";
import { getDateKey } from "../utils/date";
import { useBadge } from "./UserContext/BadgeContext";
import { ATTENDANCE_BADGE_RULES } from "../data/static/badges";

/**
 * 📅 출석 상태 관리
 * - 날짜 기준으로 출석 체크
 */

const ATTENDANCE_KEY = "attendance";

type AttendanceStorage = {
  checkedDates: string[]; //출석한 날짜 목록
  streak: number; //연속 출석 일수
};

type AttendanceContextType = {
  checkedDates: string[];
  checkToday: () => void;
  isCheckedToday: boolean;
  streak: number;
};

const AttendanceContext = createContext<AttendanceContextType>(
  {} as AttendanceContextType,
);

export const AttendanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const today = getDateKey();

  const { addCoin } = useCoin();
  const { earnBadge, hasBadge } = useBadge();

  //출석한 날짜 목록 상태, 초기값은 localstorage에서 불러옴
  const [checkedDates, setCheckedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem(ATTENDANCE_KEY);
    return saved ? JSON.parse(saved).checkedDates : [];
  });
  //연속 출석 일수 상태(로컬스토리지 기준)
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem(ATTENDANCE_KEY);
    return saved ? JSON.parse(saved).streak : 0;
  });

  //어제 날짜 key계산( 연속 출석 판단용 )
  const getYesterdayKey = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getDateKey(d);
  };

  // 오늘 출석 체크
  const checkToday = () => {
    if (checkedDates.includes(today)) return; //이미 출석했으면 리턴

    //출석날짜 추가
    setCheckedDates((prev) => [...prev, today]);

    const yesterday = getYesterdayKey();

    //연속 출석 계산 (어제 출석했으면 +1, 아니면 1부터 다시 )
    setStreak((prev: any) => {
      const nextStreak = checkedDates.includes(yesterday) ? prev + 1 : 1;

      addCoin(1); //기본 출석보상

      // 🎁 7일 연속 출석 보너스
      if (streak % 7 === 0) {
        addCoin(3);
      }

      //출석뱃지 자동지급( 조건에 맞는 streak도달시, 이미 획득한 뱃지는 제외)
      ATTENDANCE_BADGE_RULES.forEach(({ days, badgeId }) => {
        if (nextStreak === days && !hasBadge(badgeId)) {
          earnBadge(badgeId);
        }
      });

      return nextStreak;
    });
  };

  //오늘 출석여부 -> UI에서 버튼 비활성화, 체크표시용
  const isCheckedToday = checkedDates.includes(today);

  //로컬 저장
  useEffect(() => {
    const data: AttendanceStorage = {
      checkedDates,
      streak,
    };
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
  }, [checkedDates, streak]);

  return (
    <AttendanceContext.Provider
      value={{ checkedDates, checkToday, isCheckedToday, streak }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
