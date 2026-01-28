import { createContext, useContext, useState } from "react";
import { useCoin } from "./Coin&Money/CoinContext";
import { getDateKey } from "../components/utils/date";

/**
 * 📅 출석 상태 관리
 * - 날짜 기준으로 출석 체크
 */

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
  const [checkedDates, setCheckedDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  //연속 출석 계산
  const getYesterdayKey = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getDateKey(d);
  };

  // 오늘 출석 체크
  const checkToday = () => {
    if (checkedDates.includes(today)) return;
    setCheckedDates((prev) => [...prev, today]);
    // 🔥 연속 출석 계산
    const yesterday = getYesterdayKey();
    if (checkedDates.includes(yesterday)) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(1);
    }
    addCoin(1); //출석보상
    // 🎁 연속 출석 보너스
    if ((streak + 1) % 7 === 0) {
      addCoin(3); // 7일마다 보너스
    }
  };

  const isCheckedToday = checkedDates.includes(today);

  return (
    <AttendanceContext.Provider
      value={{ checkedDates, checkToday, isCheckedToday, streak }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
