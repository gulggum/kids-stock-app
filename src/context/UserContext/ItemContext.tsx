// 캐릭터 아이템 관련
//📦 보유 아이템 목록
//🛒 아이템 구매 함수
//🔍 이미 보유 여부 확인

import { createContext, useContext, useEffect, useState } from "react";
import { useCoin } from "../WalletContext/CoinContext";
import {
  characterItems,
  getRandomItem,
  MYSTERY_BOX_PRICE,
  type CharacterItem,
} from "../../data/static/characterItems";

// localStorage에 저장할 key 이름
const OWNED_KEY = "owned_items";
const EQUIPPED_KEY = "equipped_items";

// 장착 가능한 슬롯 타입
export type EquipSlot = "hair" | "hat" | "top" | "accessory";

//아이템 장작 슬롯 상태
export type EquipSlots = Record<EquipSlot, string | null>;

const DEFAULT_EQUIP: EquipSlots = {
  hair: null,
  hat: null,
  top: null,
  accessory: null,
};

//아이템 구매결과 별 토스트메세지
type BuyItemResult = "SUCCESS" | "ALREADY_OWNED" | "NOT_ENOUGH_COIN";

type ItemContextType = {
  ownedItems: string[]; //보유한 아이템 id 목록
  equippedItems: EquipSlots;
  openMysteryBox: () => CharacterItem | null;
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
      return DEFAULT_EQUIP;
    }
    return JSON.parse(saved);
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
        return { ...prev, [slot]: null };
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

  //미스터리박스 함수
  const openMysteryBox = () => {
    const success = spendCoin(MYSTERY_BOX_PRICE);
    if (!success) return null;

    // 아직 없는 아이템만 랜덤
    const available = characterItems.filter(
      (item) => !ownedItems.includes(item.id),
    );

    if (available.length === 0) return null;

    const item = getRandomItem(available);

    setOwnedItems((prev) => [...prev, item.id]);

    return item;
  };

  return (
    <ItemContext.Provider
      value={{
        ownedItems,
        equippedItems,
        buyItem,
        isOwned,
        toggleEquip,
        openMysteryBox,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => {
  return useContext(ItemContext);
};
