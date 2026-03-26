/**
 * 🎨 카드 스킨 데이터
 *
 * 등급 기준
 * - COMMON  : 일반 구매 가능 (그라디언트)
 * - SPECIAL : 미스터리 박스 or 구매 (이미지)
 * - LEGEND  : level 10 달성 후 언락 (이미지)
 *
 * 미스터리 박스 확률
 * - COMMON  70%
 * - SPECIAL 25%
 * - LEGEND   5%
 */

import legendSkinGold from "../../assets/cardSkins/legendSkinGold.png";
import specialSkin_1 from "../../assets/cardSkins/specialSkin_1.png";
import specialSkin_2 from "../../assets/cardSkins/specialSkin_2.png";

export type CardRarity = "COMMON" | "SPECIAL" | "LEGEND";

export type CardSkin = {
  id: string;
  name: string;
  price: number;
  rarity: CardRarity;
  gradient?: string; // COMMON 카드용
  image?: string; // SPECIAL/LEGEND 카드용
  unlockLevel?: number; // 레벨 제한 (없으면 누구나 가능)
};

// 미스터리 박스 가격
export const MYSTERY_BOX_PRICE = 100;

// 미스터리 박스 랜덤 아이템 뽑기
export const getRandomItem = (items: CardSkin[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const cardSkins: CardSkin[] = [
  // ─────────────────────────────────────────
  // 🎨 COMMON - 파스텔 (100~120코인)
  // ─────────────────────────────────────────
  {
    id: "skyblue",
    name: "스카이블루",
    price: 100,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #dbeafe, #93c5fd)",
  },
  {
    id: "mint",
    name: "민트",
    price: 100,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #d1fae5, #6ee7b7)",
  },
  {
    id: "banana",
    name: "바나나 옐로우",
    price: 120,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fef9c3, #fde047)",
  },
  {
    id: "peach",
    name: "피치",
    price: 120,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #ffe4e6, #fb7185)",
  },
  {
    id: "milk",
    name: "우유니 화이트",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  },

  // ─────────────────────────────────────────
  // 🎨 COMMON - 비비드 (150코인)
  // ─────────────────────────────────────────
  {
    id: "blue",
    name: "코발트 블루",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  },
  {
    id: "green",
    name: "에메랄드",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    id: "orange",
    name: "오렌지",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fdba74, #f97316)",
  },
  {
    id: "pink",
    name: "라벤더 핑크",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fbcfe8, #f472b6)",
  },
  {
    id: "tomato",
    name: "토마토 레드",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f87171, #dc2626)",
  },

  // ─────────────────────────────────────────
  // ⭐ COMMON - 프리미엄 (300~350코인)
  // ─────────────────────────────────────────
  {
    id: "purple",
    name: "딥 퍼플",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)",
  },
  {
    id: "navy",
    name: "네이비",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #1e3a8a, #0f172a)",
  },
  {
    id: "teal",
    name: "틸 블루",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #2dd4bf, #0f766e)",
  },
  {
    id: "rose",
    name: "로즈 핑크",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fda4af, #be123c)",
  },
  {
    id: "sunset",
    name: "선셋",
    price: 350,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fb7185, #f59e0b)",
  },

  // ─────────────────────────────────────────
  // 🌈 SPECIAL (500코인 or 미스터리 박스)
  // ─────────────────────────────────────────
  {
    id: "special1",
    name: "스페셜 파스텔 카드",
    price: 500,
    rarity: "SPECIAL",
    image: specialSkin_1,
  },
  {
    id: "special2",
    name: "스페셜 컬러플 카드",
    price: 500,
    rarity: "SPECIAL",
    image: specialSkin_2,
  },

  // ─────────────────────────────────────────
  // 👑 LEGEND (level 10 달성 후 언락)
  // ─────────────────────────────────────────
  {
    id: "legend1",
    name: "골드 레전드",
    price: 1000,
    rarity: "LEGEND",
    image: legendSkinGold,
    unlockLevel: 10, // ✅ 15 → 10으로 변경 (levelTitles 최대 레벨과 통일)
  },
  {
    id: "legend2",
    name: "블랙 레전드",
    price: 1200,
    rarity: "LEGEND",
    image: legendSkinGold, // TODO: 블랙 레전드 이미지 추가 시 교체
    unlockLevel: 10, // ✅ 15 → 10으로 변경
  },
];
