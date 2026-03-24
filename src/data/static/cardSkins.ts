import legendImage from "../../assets/images/legendCardImage.png";

export type CardRarity = "COMMON" | "SPECIAL" | "LEGEND";

export type CardSkin = {
  id: string;
  name: string;
  price: number;
  rarity: CardRarity;

  // 👉 선택적으로 사용
  gradient?: string; // 기본 카드용
  image?: string; // 레전드/스페셜용
  unlockLevel?: number; //레벨제한
};

//랜덤박스
export const MYSTERY_BOX_PRICE = 100;
//랜덤 대상 아이템 필터 함수
export function getRandomItem(items: CardSkin[]) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export const cardSkins: CardSkin[] = [
  // -----------------------------
  // 🎨 COMMON (부드러운 색감)
  // -----------------------------
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

  // -----------------------------
  // 🎨 COMMON (조금 더 진한 톤)
  // -----------------------------
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

  // -----------------------------
  // ⭐ COMMON (살짝 고급 느낌)
  // -----------------------------
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

  // -----------------------------
  // 🌈 SPECIAL (이미지 넣는 영역)
  // -----------------------------
  {
    id: "special1",
    name: "이벤트 카드",
    price: 500,
    rarity: "SPECIAL",
    image: "/cards/special1.png", // 👉 너가 넣으면 됨
  },

  // -----------------------------
  // 👑 LEGEND (이미지)
  // -----------------------------
  {
    id: "legend1",
    name: "골드 레전드",
    price: 1000,
    rarity: "LEGEND",
    image: "/cards/legend1.png",
    unlockLevel: 15,
  },
  {
    id: "legend2",
    name: "블랙 레전드",
    price: 1200,
    rarity: "LEGEND",
    image: "/cards/legend2.png",
    unlockLevel: 15,
  },
];
