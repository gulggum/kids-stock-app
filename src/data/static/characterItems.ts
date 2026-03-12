//캐릭터아이템 mock 데이터(추후 변경예정)

import type { EquipSlot } from "../../context/UserContext/ItemContext";

export type ItemRarity = "COMMON" | "RARE" | "LEGEND";

export type CharacterItem = {
  id: string;
  name: string;
  emoji?: string;
  image?: string;
  price: number;
  slot: EquipSlot;
  rarity: ItemRarity;
  setId?: string;
};

// -------------------------------
// 🎒 아이템 세트 효과 정의
// 같은 setId 아이템을 여러 개 착용하면 보너스 발생
// (학생머리 + 학교모자 → exp +10 )
// -------------------------------
export const ITEM_SETS = {
  school: {
    name: "School Set",
    required: 2, //최소 착용갯수
    bonus: { exp: 10 }, //보너스효과
  },

  investor: {
    name: "Investor Set",
    required: 2,
    bonus: { coin: 5 },
  },

  news: {
    name: "News Master Set",
    required: 2,
    bonus: { exp: 5 },
  },
};
export const characterItems: CharacterItem[] = [
  // -----------------
  // 💇 헤어
  // -----------------

  {
    id: "hair_basic",
    name: "기본 머리",
    emoji: "🧑",
    price: 0,
    slot: "hair",
    rarity: "COMMON",
  },

  {
    id: "hair_student",
    name: "학생 머리",
    emoji: "👦",
    price: 120,
    slot: "hair",
    rarity: "COMMON",
    setId: "school",
  },

  {
    id: "hair_star",
    name: "스타 헤어",
    emoji: "⭐",
    price: 300,
    slot: "hair",
    rarity: "RARE",
  },

  // -----------------
  // 🧢 모자
  // -----------------

  {
    id: "hat_cap",
    name: "야구 모자",
    emoji: "🧢",
    price: 120,
    slot: "hat",
    rarity: "COMMON",
    setId: "school",
  },

  {
    id: "hat_crown",
    name: "투자왕 왕관",
    emoji: "👑",
    price: 350,
    slot: "hat",
    rarity: "LEGEND",
  },

  {
    id: "hat_news",
    name: "기자 모자",
    emoji: "🎩",
    price: 200,
    slot: "hat",
    rarity: "RARE",
  },

  // -----------------
  // 👕 옷
  // -----------------

  {
    id: "top_uniform",
    name: "학교 티셔츠",
    emoji: "👕",
    price: 200,
    slot: "top",
    rarity: "COMMON",
    setId: "school",
  },

  {
    id: "top_suit",
    name: "투자 슈트",
    emoji: "🕴️",
    price: 350,
    slot: "top",
    rarity: "RARE",
  },

  {
    id: "top_gold",
    name: "황금 재킷",
    emoji: "💰",
    price: 500,
    slot: "top",
    rarity: "LEGEND",
  },

  // -----------------
  // 🎒 악세서리
  // -----------------

  {
    id: "acc_glasses",
    name: "투자 안경",
    emoji: "👓",
    price: 150,
    slot: "accessory",
    rarity: "COMMON",
  },

  {
    id: "acc_chart",
    name: "주식 차트",
    emoji: "📈",
    price: 200,
    slot: "accessory",
    rarity: "RARE",
  },

  {
    id: "acc_goldbag",
    name: "금화 가방",
    emoji: "💰",
    price: 400,
    slot: "accessory",
    rarity: "LEGEND",
  },
];
