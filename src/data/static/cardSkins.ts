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

import specialSkin_1 from "../../assets/cardSkins/specialSkin_1.png";
import specialSkin_2 from "../../assets/cardSkins/specialSkin_2.png";
import specialSkin_korea from "../../assets/cardSkins/specialSkin_3.png";
import specialSkin_cinderella from "../../assets/cardSkins/specialSkin_4.png";
import legendSkinGold from "../../assets/cardSkins/legendSkinGold.png";
import legendSkinPupple from "../../assets/cardSkins/legendSkinPupple.png";
import legendSkinRainbow from "../../assets/cardSkins/legendSkinRainbow.png";
import legendSkinBlack from "../../assets/cardSkins/legendSkinBlack.png";
import { getDateKey } from "../../utils/date";

export type CardRarity = "COMMON" | "SPECIAL" | "LEGEND";

export type CardSkin = {
  id: string;
  name: string;
  price: number;
  rarity: CardRarity;
  gradient?: string; // COMMON 카드용
  image?: string; // SPECIAL/LEGEND 카드용
  unlockLevel?: number; // 레벨 제한 (없으면 누구나 가능)
  releasedAt?: string; //new 배지용
};

// 미스터리 박스 가격
export const MYSTERY_BOX_PRICE = 100;
export const MYSTERY_BOX_DUPLICATE_REFUND = 50;

// 미스터리 박스 랜덤 아이템 뽑기
export const getRandomItem = (items: CardSkin[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const isNewItem = (releasedAt?: string) => {
  if (!releasedAt) return false;

  const releaseDate = new Date(releasedAt);
  const now = new Date();

  const diff = now.getTime() - releaseDate.getTime();
  const days = diff / (1000 * 60 * 60 * 24);

  return days <= 7;
};

export const cardSkins: CardSkin[] = [
  // ─────────────────────────────────────────
  // 🎨 COMMON - 파스텔 (100~150코인)
  // ─────────────────────────────────────────
  {
    id: "basic",
    name: "기본",
    price: 0,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #E8F5E9, #F1F8E9)",
    releasedAt: "2026-03-01",
  },
  {
    id: "skyblue",
    name: "스카이블루",
    price: 100,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #dbeafe, #93c5fd)",
    releasedAt: "2026-03-10",
  },
  {
    id: "mint",
    name: "민트",
    price: 100,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #d1fae5, #6ee7b7)",
    releasedAt: "2026-03-10",
  },
  {
    id: "banana",
    name: "바나나 옐로우",
    price: 120,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fef9c3, #fde047)",
    releasedAt: "2026-03-12",
  },
  {
    id: "peach",
    name: "피치",
    price: 120,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #ffe4e6, #fb7185)",
    releasedAt: "2026-03-14",
  },
  {
    id: "milk",
    name: "우유니 화이트",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    releasedAt: "2026-03-15",
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
    releasedAt: "2026-03-18",
  },
  {
    id: "green",
    name: "에메랄드",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    releasedAt: "2026-03-18",
  },
  {
    id: "orange",
    name: "오렌지",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fdba74, #f97316)",
    releasedAt: "2026-03-20",
  },
  {
    id: "pink",
    name: "라벤더 핑크",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fbcfe8, #f472b6)",
    releasedAt: "2026-03-20",
  },
  {
    id: "tomato",
    name: "토마토 레드",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f87171, #dc2626)",
    releasedAt: "2026-03-22",
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
    releasedAt: "2026-03-25",
  },
  {
    id: "navy",
    name: "네이비",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #1e3a8a, #0f172a)",
    releasedAt: "2026-03-26",
  },
  {
    id: "teal",
    name: "틸 블루",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #2dd4bf, #0f766e)",
    releasedAt: "2026-03-26",
  },
  {
    id: "rose",
    name: "로즈 핑크",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fda4af, #be123c)",
    releasedAt: "2026-03-28",
  },
  {
    id: "sunset",
    name: "선셋",
    price: 350,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fb7185, #f59e0b)",
    releasedAt: "2026-03-28",
  },

  // ─────────────────────────────────────────
  // 🌈 SPECIAL (500코인 or 미스터리 박스)
  // ─────────────────────────────────────────
  {
    id: "special2",
    name: "스페셜 컬러풀",
    price: 500,
    rarity: "SPECIAL",
    image: specialSkin_2,
    releasedAt: "2026-04-01",
  },
  {
    id: "special3",
    name: "스페셜 키즈스톡",
    price: 500,
    rarity: "SPECIAL",
    image: specialSkin_1,
    releasedAt: "2026-04-02",
  },
  {
    id: "special4",
    name: "스페셜 한국",
    price: 500,
    rarity: "SPECIAL",
    image: specialSkin_korea,
    releasedAt: "2026-03-28",
  },
  {
    id: "special5",
    name: "스페셜 신데렐라",
    price: 500,
    rarity: "SPECIAL",
    image: specialSkin_cinderella,
    releasedAt: "2026-03-28",
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
    unlockLevel: 10,
    releasedAt: "2026-03-30",
  },
  {
    id: "legend2",
    name: "블랙 레전드",
    price: 1200,
    rarity: "LEGEND",
    image: legendSkinBlack,
    unlockLevel: 10,
    releasedAt: "2026-04-10",
  },
  {
    id: "legend3",
    name: "퍼플 레전드",
    price: 1200,
    rarity: "LEGEND",
    image: legendSkinPupple,
    unlockLevel: 10,
    releasedAt: "2026-03-28",
  },
  {
    id: "legend4",
    name: "레인보우 레전드",
    price: 1200,
    rarity: "LEGEND",
    image: legendSkinRainbow,
    unlockLevel: 10,
    releasedAt: "2026-03-28",
  },

  // ─────────────────────────────────────────
  // 🆕 2026-04 신규 업데이트
  // ─────────────────────────────────────────
  {
    id: "lavender",
    name: "라벤더",
    price: 100,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f3e8ff, #d8b4fe)",
    releasedAt: getDateKey(),
  },
  {
    id: "cotton",
    name: "솜사탕 핑크",
    price: 100,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #ffe4f1, #fbcfe8)",
    releasedAt: getDateKey(),
  },
  {
    id: "cream",
    name: "크림 베이지",
    price: 100,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fff7ed, #fde68a)",
    releasedAt: getDateKey(),
  },
  {
    id: "lemon",
    name: "레몬 밀크",
    price: 120,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fffde7, #fef08a)",
    releasedAt: getDateKey(),
  },
  {
    id: "babyblue",
    name: "베이비 블루",
    price: 120,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #eff6ff, #bfdbfe)",
    releasedAt: getDateKey(),
  },
  {
    id: "lilac",
    name: "라일락",
    price: 120,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f5f3ff, #c4b5fd)",
    releasedAt: getDateKey(),
  },
  {
    id: "matcha",
    name: "말차 크림",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f0fdf4, #bbf7d0)",
    releasedAt: getDateKey(),
  },
  {
    id: "coral",
    name: "코랄 피치",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fff1f2, #fda4af)",
    releasedAt: getDateKey(),
  },

  // ─────────────────────────────────────────
  // 🆕 2026-04 신규 업데이트 - 비비드
  // ─────────────────────────────────────────
  {
    id: "royalblue",
    name: "로열 블루",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
    releasedAt: getDateKey(),
  },
  {
    id: "berry",
    name: "베리 퍼플",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #c084fc, #8b5cf6)",
    releasedAt: getDateKey(),
  },
  {
    id: "melon",
    name: "멜론 그린",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #86efac, #22c55e)",
    releasedAt: getDateKey(),
  },
  {
    id: "tangerine",
    name: "탠저린",
    price: 150,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fdba74, #fb923c)",
    releasedAt: getDateKey(),
  },
  {
    id: "magenta",
    name: "마젠타 핑크",
    price: 180,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f9a8d4, #ec4899)",
    releasedAt: getDateKey(),
  },
  {
    id: "aqua",
    name: "아쿠아",
    price: 180,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #67e8f9, #06b6d4)",
    releasedAt: getDateKey(),
  },
  {
    id: "violet",
    name: "바이올렛",
    price: 180,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
    releasedAt: getDateKey(),
  },
  {
    id: "cherry",
    name: "체리 레드",
    price: 200,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fca5a5, #ef4444)",
    releasedAt: getDateKey(),
  },

  // ─────────────────────────────────────────
  // 🆕 2026-04 신규 업데이트 - 프리미엄
  // ─────────────────────────────────────────
  {
    id: "midnight",
    name: "미드나잇 블루",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #334155, #0f172a)",
    releasedAt: getDateKey(),
  },
  {
    id: "plum",
    name: "플럼 퍼플",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #d8b4fe, #7e22ce)",
    releasedAt: getDateKey(),
  },
  {
    id: "wine",
    name: "와인 레드",
    price: 300,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fca5a5, #9f1239)",
    releasedAt: getDateKey(),
  },
  {
    id: "forest",
    name: "포레스트",
    price: 320,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #4ade80, #166534)",
    releasedAt: getDateKey(),
  },
  {
    id: "ocean",
    name: "오션 블루",
    price: 320,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #7dd3fc, #0369a1)",
    releasedAt: getDateKey(),
  },
  {
    id: "aurora",
    name: "오로라",
    price: 350,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #a5f3fc, #c084fc)",
    releasedAt: getDateKey(),
  },
  {
    id: "ruby",
    name: "루비 핑크",
    price: 350,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fda4af, #e11d48)",
    releasedAt: getDateKey(),
  },
  {
    id: "goldenlavender",
    name: "골든 라벤더",
    price: 400,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #f5e6c8, #c4b5fd)",
    releasedAt: getDateKey(),
  },
  {
    id: "champagne",
    name: "샴페인 골드",
    price: 400,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #fef3c7, #fcd34d)",
    releasedAt: getDateKey(),
  },
  {
    id: "icequeen",
    name: "아이스 퀸",
    price: 400,
    rarity: "COMMON",
    gradient: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
    releasedAt: getDateKey(),
  },
];
