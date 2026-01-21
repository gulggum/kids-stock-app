//📦 보유 아이템 목록
//🛒 아이템 구매 함수
//🔍 이미 보유 여부 확인

import { createContext, useContext, useState } from "react";
import { useCoin } from "./CoinContext";

type BuyItemResult = "SUCCESS" | "ALREADY_OWNED" | "NOT_ENOUGH_COIN";

type ItemContextType = {
  ownedItems: string[]; //보유한 아이템 id 목록
  buyItem: (id: string, price: number) => BuyItemResult; //아이템 구매
  isOwned: (id: string) => boolean; //보유 여부 확인
};

// {} as 타입 단언: 반드시 Provider 안에서만 사용한다는 약속
const ItemContext = createContext<ItemContextType>({} as ItemContextType);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
  const { spendCoin } = useCoin();
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  //아이템 구매함수 / 코인차감 / 성공시 아이템 보유 목록에 추가

  const buyItem = (id: string, price: number): BuyItemResult => {
    if (ownedItems.includes(id)) return "ALREADY_OWNED"; //이미보유

    const success = spendCoin(price); //코인부족
    if (!success) return "NOT_ENOUGH_COIN";

    setOwnedItems((prev) => [...prev, id]); //구매성공
    return "SUCCESS";
  };
  //아이템 보유 여부 확인
  const isOwned = (id: string) => {
    return ownedItems.includes(id);
  };

  return (
    <ItemContext.Provider value={{ ownedItems, buyItem, isOwned }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => {
  return useContext(ItemContext);
};
