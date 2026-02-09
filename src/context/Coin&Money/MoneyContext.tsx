import { createContext, useContext, useEffect, useState } from "react";

/**
 * 💰 주식 학습용 머니 Context
 * - 주식 가격/가치 개념을 위한 화폐
 * - 지금 단계에서는 부족해도 구매를 막지 않음
 */
const MONEY_KEY = "money";
const DEV_START_MONEY = 1000000; //코인테스트용 임시머니(개발용)

export type MoneyContextType = {
  money: number;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
};

const MoneyContext = createContext<MoneyContextType>({} as MoneyContextType);

export const MoneyProvider = ({ children }: { children: React.ReactNode }) => {
  const [money, setMoney] = useState<number>(() => {
    const saved = localStorage.getItem(MONEY_KEY);
    return saved ? Number(saved) : DEV_START_MONEY;
  }); // 시작 머니

  const addMoney = (amount: number) => {
    setMoney((prev) => prev + amount);
  };

  const spendMoney = (amount: number) => {
    if (money < amount) return false;
    setMoney((prev) => prev - amount);
    return true;
  };

  useEffect(() => {
    localStorage.setItem(MONEY_KEY, String(money));
  }, [money]);

  return (
    <MoneyContext.Provider value={{ money, addMoney, spendMoney }}>
      {children}
    </MoneyContext.Provider>
  );
};

export const useMoney = () => useContext(MoneyContext);
