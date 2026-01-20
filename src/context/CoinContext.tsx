import { createContext, useContext, useState } from "react";

export type CoinContextType = {
  coins?: number; //현재 보유 코인
  addCoin: (amount?: number) => void; //코인지급
  spendCoin: (amount: number) => boolean; //코인 사용(성공여부) - 아이템구매용
};

const CoinContext = createContext<CoinContextType>({} as CoinContextType); //무조건 Provider 안에서만 사용하겠다

export const CoinProvider = ({ children }: { children: React.ReactNode }) => {
  const [coins, setCoins] = useState(0);

  //코인지급 , 기본값은 1코인(오늘의 한번 보상용)
  const addCoin = (amount: number = 1) => {
    setCoins((prev) => prev + amount);
  };

  //코인사용 , 코인이 부족하면 false 반환
  const spendCoin = (amount: number) => {
    if (coins < amount) return false;
    setCoins((prev) => prev - amount);
    return true;
  };
  return (
    <CoinContext.Provider value={{ coins, addCoin, spendCoin }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoin = () => {
  return useContext(CoinContext);
};
