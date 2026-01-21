import { createContext, useContext, useState } from "react";

const DEV_START_COIN = 9999; //코인테스트용 임시코인(개발용)

export type CoinContextType = {
  coins?: number; //현재 보유 코인
  addCoin: (amount?: number) => void; //코인지급
  spendCoin: (amount: number) => boolean; //코인 사용(성공여부) - 아이템구매용
};

const CoinContext = createContext<CoinContextType>({} as CoinContextType); //무조건 Provider 안에서만 사용하겠다

export const CoinProvider = ({ children }: { children: React.ReactNode }) => {
  const [coins, setCoins] = useState<number>(DEV_START_COIN); //코인테스트용(개발용)
  // const [coins, setCoins] = useState(0);추후변경

  //코인지급 , 기본값은 1코인(오늘의 한번 보상용)
  const addCoin = (amount: number = 1) => {
    setCoins((prev) => prev + amount);
  };

  //코인사용 , 코인이 부족하면 false 반환
  const spendCoin = (amount: number) => {
    let success = false;
    setCoins((prev) => {
      if (prev < amount) {
        success = false; //코인 부족(아무변화x)
        return prev;
      }

      success = true; //사용 성공
      return prev - amount;
    });

    return success;
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
