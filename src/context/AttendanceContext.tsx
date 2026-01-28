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

  // 오늘 출석 체크
  const checkToday = () => {
    if (checkedDates.includes(today)) return;
    setCheckedDates((prev) => [...prev, today]);

    addCoin(1); //출석보상
  };

  const isCheckedToday = checkedDates.includes(today);

  return (
    <AttendanceContext.Provider
      value={{ checkedDates, checkToday, isCheckedToday }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
