/**
 * 📦 SkinItemContext
 *
 * 역할: 카드 스킨 구매 / 선택 / 미스터리박스 로직 관리
 *
 * ✅ 리팩토링
 * - 변경: user.ownedSkins, user.selectedSkin 직접 사용
 * → 저장은 UserContext의 useEffect가 "user" 키 하나로 통합 처리
 */

import { createContext, useContext } from "react";
import {
  cardSkins,
  MYSTERY_BOX_DUPLICATE_REFUND,
  MYSTERY_BOX_PRICE,
  type CardRarity,
  type CardSkin,
} from "../data/static/cardSkins";
import { useUser } from "./UserContext";

// ─────────────────────────────────────────
// 📌 타입 정의
// ─────────────────────────────────────────

// 구매 결과
type BuyResult =
  | "SUCCESS" // 구매 성공
  | "ALREADY_OWNED" // 이미 보유
  | "NOT_ENOUGH_COIN"; // 코인 부족

// 미스터리박스 결과
type MysteryBoxResult = CardSkin & {
  duplicate?: boolean; // 중복 여부
};

type SkinItemContextType = {
  ownedSkins: string[]; // 보유 스킨 목록
  selectedSkin: string; // 선택된 스킨
  buySkin: (id: string, price: number) => BuyResult;
  selectSkin: (id: string) => void;
  isOwned: (id: string) => boolean;
  openMysteryBox: () => MysteryBoxResult | null | "NOT_ENOUGH_COIN";
};

// ─────────────────────────────────────────
// 📌 Context 생성
// ─────────────────────────────────────────
const SkinItemContext = createContext<SkinItemContextType>(
  {} as SkinItemContextType,
);

// ─────────────────────────────────────────
// 📌 Provider
// ─────────────────────────────────────────
export const SkinItemProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // user에서 직접 읽기
  // ✅ setUser로 user 안의 ownedSkins, selectedSkin 업데이트
  // ✅ 저장은 UserContext useEffect가 담당
  const { user, setUser, spendCoin, addCoin } = useUser();

  // 💰 스킨 구매
  const buySkin = (id: string, price: number): BuyResult => {
    if (user.ownedSkins.includes(id)) return "ALREADY_OWNED";

    const success = spendCoin(price);
    if (!success) return "NOT_ENOUGH_COIN";

    // ✅ setUser로 user.ownedSkins 업데이트
    setUser((prev) => ({
      ...prev,
      ownedSkins: [...prev.ownedSkins, id],
    }));

    return "SUCCESS";
  };

  // 🎨 스킨 선택 (보유한 것만 가능)
  const selectSkin = (id: string) => {
    if (!user.ownedSkins.includes(id)) return;

    // ✅ setUser로 user.selectedSkin 업데이트
    setUser((prev) => ({ ...prev, selectedSkin: id }));
  };

  // 🔍 보유 여부 확인
  const isOwned = (id: string) => user.ownedSkins.includes(id);

  // 🎁 미스터리박스
  const openMysteryBox = (): MysteryBoxResult | null | "NOT_ENOUGH_COIN" => {
    // ✅ 코인 차감 먼저
    const success = spendCoin(MYSTERY_BOX_PRICE);
    if (!success) return "NOT_ENOUGH_COIN";
    const roll = Math.random() * 100;

    // 확률로 등급 결정
    let rarity: CardRarity;
    if (roll < 5)
      rarity = "LEGEND"; // 5%
    else if (roll < 20)
      rarity = "SPECIAL"; // 25%
    else rarity = "COMMON"; // 70%

    // 해당 등급 카드 필터 (기본카드 제외)
    const candidates = cardSkins.filter(
      (s) => s.rarity === rarity && s.price > 0,
    );
    if (candidates.length === 0) return null;

    const random = candidates[Math.floor(Math.random() * candidates.length)];
    const alreadyOwned = user.ownedSkins.includes(random.id);

    // ✅ 중복이면 코인 50 환불
    if (alreadyOwned) {
      addCoin(MYSTERY_BOX_DUPLICATE_REFUND);
    }

    // 새 카드면 보유 목록에 추가
    if (!alreadyOwned) {
      setUser((prev) => ({
        ...prev,
        ownedSkins: [...prev.ownedSkins, random.id],
      }));
    }

    return { ...random, duplicate: alreadyOwned };
  };

  return (
    <SkinItemContext.Provider
      value={{
        ownedSkins: user.ownedSkins, // ✅ user에서 직접
        selectedSkin: user.selectedSkin, // ✅ user에서 직접
        buySkin,
        selectSkin,
        isOwned,
        openMysteryBox,
      }}
    >
      {children}
    </SkinItemContext.Provider>
  );
};

// ─────────────────────────────────────────
// 📌 커스텀 훅
// ─────────────────────────────────────────
export const useSkinItem = () => {
  const context = useContext(SkinItemContext);
  if (!context)
    throw new Error("useSkinItem must be used within SkinItemProvider");
  return context;
};
