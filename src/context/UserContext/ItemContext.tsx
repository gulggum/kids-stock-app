import { createContext, useContext, useEffect, useState } from "react";
import {
  cardSkins,
  type CardRarity,
  type CardSkin,
} from "../../data/static/cardSkins";
import { useUser } from "./UserContext";

// -----------------------------
// 📌 localStorage 키
// -----------------------------
const OWNED_KEY = "owned_skins"; // 보유 스킨 목록
const SELECTED_KEY = "selected_skin"; // 현재 선택된 스킨

// -----------------------------
// 📌 구매 결과 타입
// -----------------------------
type BuyResult =
  | "SUCCESS" // 구매 성공
  | "ALREADY_OWNED" // 이미 보유
  | "NOT_ENOUGH_COIN"; // 코인 부족

//미스터리박스 반환타입
type MysteryBoxResult = CardSkin & {
  duplicate?: boolean;
};

// -----------------------------
// 📌 Context 타입 정의
// -----------------------------
type ItemContextType = {
  ownedSkins: string[]; // 내가 가진 카드 스킨 목록
  selectedSkin: string | null; // 현재 적용된 카드 스킨
  openMysteryBox: () => MysteryBoxResult | null;

  buySkin: (id: string, price: number) => BuyResult; // 구매 함수
  selectSkin: (id: string) => void; // 스킨 적용 함수
  isOwned: (id: string) => boolean; // 보유 여부 확인
};

// -----------------------------
// 📌 Context 생성
// -----------------------------
const ItemContext = createContext<ItemContextType>({} as ItemContextType);

// -----------------------------
// 📌 Provider (전역 상태 관리)
// -----------------------------
export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
  const { spendCoin } = useUser(); // 코인 차감 함수

  // -----------------------------
  // 🎒 보유 스킨 상태
  // -----------------------------
  const [ownedSkins, setOwnedSkins] = useState<string[]>(() => {
    const saved = localStorage.getItem(OWNED_KEY);

    // 처음 실행이면 기본 카드 지급
    if (!saved) return ["basic"];

    return JSON.parse(saved);
  });

  // -----------------------------
  // 🎨 현재 선택된 스킨
  // -----------------------------
  const [selectedSkin, setSelectedSkin] = useState<string | null>(() => {
    const saved = localStorage.getItem(SELECTED_KEY);

    // 기본값: basic 카드
    return saved || "basic";
  });

  // -----------------------------
  // 💰 스킨 구매 함수
  // -----------------------------
  const buySkin = (id: string, price: number): BuyResult => {
    // 이미 가지고 있는 경우
    if (ownedSkins.includes(id)) {
      return "ALREADY_OWNED";
    }

    // 코인 차감 시도
    const success = spendCoin(price);

    // 코인 부족
    if (!success) {
      return "NOT_ENOUGH_COIN";
    }

    // 구매 성공 → 보유 목록 추가
    setOwnedSkins((prev) => [...prev, id]);

    return "SUCCESS";
  };

  // -----------------------------
  // 🎨 스킨 적용 함수
  // -----------------------------
  const selectSkin = (id: string) => {
    // 보유하지 않은 스킨이면 적용 불가
    if (!ownedSkins.includes(id)) return;

    setSelectedSkin(id);
  };

  // -----------------------------
  // 🔍 보유 여부 확인
  // -----------------------------
  const isOwned = (id: string) => {
    return ownedSkins.includes(id);
  };

  // -----------------------------
  // 💾 localStorage 저장 (보유 스킨)
  // -----------------------------
  useEffect(() => {
    localStorage.setItem(OWNED_KEY, JSON.stringify(ownedSkins));
  }, [ownedSkins]);

  // -----------------------------
  // 💾 localStorage 저장 (선택된 스킨)
  // -----------------------------
  useEffect(() => {
    if (selectedSkin) {
      localStorage.setItem(SELECTED_KEY, selectedSkin);
    }
  }, [selectedSkin]);

  //미스터리박스 함수
  // -----------------------------
  // 📌 반환 타입
  // -----------------------------
  type MysteryBoxResult = CardSkin & {
    duplicate?: boolean; // 중복 여부
  };

  // -----------------------------
  // 🎁 미스터리 박스 열기
  // -----------------------------
  const openMysteryBox = (): MysteryBoxResult | null => {
    // -----------------------------
    // 🎲 확률로 등급 결정
    // -----------------------------
    const roll = Math.random() * 100;

    let rarity: CardRarity;

    if (roll < 5)
      rarity = "LEGEND"; // 5%
    else if (roll < 30)
      rarity = "SPECIAL"; // 25%
    else rarity = "COMMON"; // 70%

    // -----------------------------
    // 🎯 해당 등급 카드만 필터
    // (기본카드 제외 price 0)
    // -----------------------------
    const candidates = cardSkins.filter(
      (item) => item.rarity === rarity && item.price > 0,
    );

    // 👉 안전 처리 (없을 경우)
    if (candidates.length === 0) return null;

    // -----------------------------
    // 🎲 랜덤 카드 선택
    // -----------------------------
    const random = candidates[Math.floor(Math.random() * candidates.length)];

    // -----------------------------
    // 🎒 이미 가지고 있는지 체크
    // -----------------------------
    const alreadyOwned = ownedSkins.includes(random.id);

    // -----------------------------
    // 🆕 새로운 카드면 추가
    // -----------------------------
    if (!alreadyOwned) {
      setOwnedSkins((prev) => [...prev, random.id]);
    }

    // -----------------------------
    // 🎁 결과 반환
    // -----------------------------
    return {
      ...random,
      duplicate: alreadyOwned,
    };
  };

  // -----------------------------
  // 📦 Provider 반환
  // -----------------------------
  return (
    <ItemContext.Provider
      value={{
        ownedSkins,
        selectedSkin,
        buySkin,
        selectSkin,
        isOwned,
        openMysteryBox,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

// -----------------------------
// 📌 커스텀 훅
// -----------------------------
export const useItem = () => {
  return useContext(ItemContext);
};
