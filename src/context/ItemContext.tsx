// 캐릭터 아이템 관련
//📦 보유 아이템 목록
//🛒 아이템 구매 함수
//🔍 이미 보유 여부 확인

import { createContext, useContext, useEffect, useState } from "react";
import { useCoin } from "./Coin&Money/CoinContext";

// localStorage에 저장할 key 이름
const OWNED_KEY = "owned_items";
const EQUIPPED_KEY = "equipped_items";

// 장착 가능한 슬롯 타입
export type EquipSlot = "hat" | "top" | "shoes";

//아이템 장작 슬롯
export type EquipSlots = Record<EquipSlot, string | null>;

//아이템 구매결과 별 토스트메세지
type BuyItemResult = "SUCCESS" | "ALREADY_OWNED" | "NOT_ENOUGH_COIN";

type ItemContextType = {
  ownedItems: string[]; //보유한 아이템 id 목록
  equippedItems: EquipSlots;

  buyItem: (id: string, price: number) => BuyItemResult; //아이템 구매
  isOwned: (id: string) => boolean; //보유 여부 확인

  toggleEquip: (slot: keyof EquipSlots, id: string) => void; //장착토글
};

// {} as 타입 단언: 반드시 Provider 안에서만 사용한다는 약속
const ItemContext = createContext<ItemContextType>({} as ItemContextType);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
  const { spendCoin } = useCoin();
  const [ownedItems, setOwnedItems] = useState<string[]>(() => {
    //처음 렌더될 때 한번만 실행, 렌더링마다 localStorage 읽지않음
    const saved = localStorage.getItem(OWNED_KEY);
    // 값이 없거나, 잘못된 값이면 기본값 반환
    if (!saved || saved === "undefined") {
      return [];
    }
    return saved ? JSON.parse(saved) : [];
  });
  const [equippedItems, setEquippedItems] = useState<EquipSlots>(() => {
    const saved = localStorage.getItem(EQUIPPED_KEY);

    if (!saved || saved === "undefined") {
      return {};
    }
    return saved ? JSON.parse(saved) : {};
  });

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

  //아이템 장작 및 해제
  const toggleEquip = (slot: keyof EquipSlots, id: string) => {
    setEquippedItems((prev) => {
      //이미 해당 슬롯에 장착되어 있으면 ->해제
      if (prev[slot] === id) {
        return { ...prev, [slot]: undefined };
      }
      //아니면 -> 해당 슬롯에 장착
      return { ...prev, [slot]: id };
    });
  };
  // ownedItems가 바뀌면 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(OWNED_KEY, JSON.stringify(ownedItems));
  }, [ownedItems]);
  // equippedItems가 바뀌면 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(EQUIPPED_KEY, JSON.stringify(equippedItems));
  }, [equippedItems]);

  return (
    <ItemContext.Provider
      value={{ ownedItems, equippedItems, buyItem, isOwned, toggleEquip }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => {
  return useContext(ItemContext);
};
