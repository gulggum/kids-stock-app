// ─────────────────────────────────────────
// 📌 타입 정의
// ─────────────────────────────────────────
export type House = {
  id: string;
  name: string;
  description: string;
  price: number;
  requiredLevel: number;
  badge: string; // SVG 뱃지 또는 이미지파일 사용 가능(집보유뱃지)
  sortOrder: number;
};

// ─────────────────────────────────────────
// 🏠 레벨 티어 (상점 배지 색상용)
// ─────────────────────────────────────────
export const getHouseTier = (requiredLevel: number) => {
  if (requiredLevel >= 10)
    return {
      label: "Lv.10",
      color: "purple",
      gradient: "linear-gradient(135deg, #1a1a3a, #6060d8)",
    };
  if (requiredLevel >= 8)
    return {
      label: "Lv.8+",
      color: "orange",
      gradient: "linear-gradient(135deg, #f0e8d8, #c8900a)",
    };
  if (requiredLevel >= 6)
    return {
      label: "Lv.6+",
      color: "green",
      gradient: "linear-gradient(135deg, #e8f5e8, #3a8a4a)",
    };
  if (requiredLevel >= 4)
    return {
      label: "Lv.4+",
      color: "blue",
      gradient: "linear-gradient(135deg, #dce8f5, #5590c0)",
    };
  return {
    label: "기본",
    color: "gray",
    gradient: "linear-gradient(135deg, #f5ede0, #d4a96a)",
  };
};

// ─────────────────────────────────────────
// 🏷 SVG 뱃지 (커뮤니티 카드용)
// ─────────────────────────────────────────
const BADGE_BASIC = `<svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="#FFF3E0" stroke="#E8A030" stroke-width="2.5"/>
  <polygon points="32,10 54,28 10,28" fill="#E05252" stroke="#C03030" stroke-width="1"/>
  <rect x="14" y="28" width="36" height="22" rx="2" fill="#F5EDE0" stroke="#D4A96A" stroke-width="1.2"/>
  <rect x="27" y="36" width="10" height="14" rx="2" fill="#C8A05A"/>
  <rect x="16" y="31" width="8" height="7" rx="1" fill="#AED6F1"/>
  <rect x="40" y="31" width="8" height="7" rx="1" fill="#AED6F1"/>
  <rect x="40" y="12" width="5" height="10" fill="#C03030"/>
</svg>`;

const BADGE_APT = `<svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="#E3F2FD" stroke="#378ADD" stroke-width="2.5"/>
  <rect x="16" y="16" width="32" height="34" rx="2" fill="#DCE8F5" stroke="#5590C0" stroke-width="1.2"/>
  <rect x="16" y="12" width="32" height="6" rx="2" fill="#5590C0"/>
  <rect x="19" y="20" width="6" height="5" rx="1" fill="#AED6F1"/>
  <rect x="29" y="20" width="6" height="5" rx="1" fill="#AED6F1"/>
  <rect x="39" y="20" width="6" height="5" rx="1" fill="#AED6F1"/>
  <rect x="19" y="29" width="6" height="5" rx="1" fill="#AED6F1"/>
  <rect x="39" y="29" width="6" height="5" rx="1" fill="#AED6F1"/>
  <rect x="27" y="38" width="10" height="12" rx="1" fill="#5590C0" opacity="0.5"/>
  <line x1="32" y1="8" x2="32" y2="4" stroke="#5590C0" stroke-width="1.5"/>
  <circle cx="32" cy="4" r="2" fill="#5590C0"/>
</svg>`;

const BADGE_PENTHOUSE = `<svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="#E8F5E9" stroke="#3A8A4A" stroke-width="2.5"/>
  <rect x="14" y="20" width="36" height="30" rx="2" fill="#E8F5E8" stroke="#5AAA6A" stroke-width="1.2"/>
  <rect x="20" y="13" width="24" height="9" rx="2" fill="#C8EEC8" stroke="#5AAA6A" stroke-width="1"/>
  <ellipse cx="24" cy="13" rx="4" ry="3" fill="#5AAA6A" opacity="0.7"/>
  <ellipse cx="32" cy="12" rx="3" ry="2" fill="#3A8A4A" opacity="0.8"/>
  <ellipse cx="40" cy="13" rx="4" ry="3" fill="#5AAA6A" opacity="0.7"/>
  <rect x="16" y="24" width="7" height="6" rx="1" fill="#AED6F1"/>
  <rect x="41" y="24" width="7" height="6" rx="1" fill="#AED6F1"/>
  <rect x="27" y="42" width="10" height="8" rx="1" fill="#5AAA6A" opacity="0.4"/>
</svg>`;

const BADGE_CASTLE = `<svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="#FFF8E1" stroke="#C8900A" stroke-width="3"/>
  <circle cx="32" cy="32" r="27" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.6"/>
  <rect x="18" y="28" width="28" height="22" rx="1" fill="#F0E8D8" stroke="#A07840" stroke-width="1"/>
  <rect x="10" y="20" width="10" height="30" rx="1" fill="#E8DCC8" stroke="#A07840" stroke-width="1"/>
  <rect x="44" y="20" width="10" height="30" rx="1" fill="#E8DCC8" stroke="#A07840" stroke-width="1"/>
  <rect x="10" y="16" width="4" height="6" fill="#E8DCC8" stroke="#A07840" stroke-width="0.8"/>
  <rect x="16" y="16" width="4" height="6" fill="#E8DCC8" stroke="#A07840" stroke-width="0.8"/>
  <rect x="44" y="16" width="4" height="6" fill="#E8DCC8" stroke="#A07840" stroke-width="0.8"/>
  <rect x="50" y="16" width="4" height="6" fill="#E8DCC8" stroke="#A07840" stroke-width="0.8"/>
  <line x1="12" y1="16" x2="12" y2="10" stroke="#A07840" stroke-width="1"/>
  <polygon points="12,10 17,12 12,14" fill="#E05252"/>
  <line x1="52" y1="16" x2="52" y2="10" stroke="#A07840" stroke-width="1"/>
  <polygon points="52,10 57,12 52,14" fill="#E05252"/>
</svg>`;

const BADGE_SPACE = `<svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="#1a1a3a" stroke="#6060D8" stroke-width="3"/>
  <circle cx="32" cy="32" r="27" fill="none" stroke="#9090FF" stroke-width="0.8" opacity="0.5" stroke-dasharray="4,3"/>
  <circle cx="18" cy="16" r="1.5" fill="#9090FF" opacity="0.9"/>
  <circle cx="48" cy="12" r="1" fill="#fff" opacity="0.8"/>
  <circle cx="52" cy="28" r="1.5" fill="#FFD700" opacity="0.9"/>
  <rect x="16" y="26" width="32" height="24" rx="6" fill="#1a1a3a" stroke="#6060D8" stroke-width="1.5"/>
  <rect x="20" y="30" width="24" height="16" rx="4" fill="none" stroke="#9090FF" stroke-width="1.5"/>
  <ellipse cx="32" cy="26" rx="14" ry="8" fill="#1a1a3a" stroke="#6060D8" stroke-width="1.2"/>
  <rect x="4" y="32" width="10" height="14" rx="1" fill="#2040A0" stroke="#4060D8" stroke-width="1"/>
  <rect x="50" y="32" width="10" height="14" rx="1" fill="#2040A0" stroke="#4060D8" stroke-width="1"/>
  <circle cx="32" cy="20" r="3" fill="#9090FF" opacity="0.8"/>
  <circle cx="32" cy="20" r="1.5" fill="#fff" opacity="0.9"/>
</svg>`;

// ─────────────────────────────────────────
// 🏘 집 목록 데이터
// ─────────────────────────────────────────
export const HOUSES: House[] = [
  {
    id: "house_basic",
    name: "기본 지붕집",
    description: "포근한 빨간 지붕의 첫 번째 집",
    price: 0,
    requiredLevel: 1,
    sortOrder: 1,
    badge: BADGE_BASIC,
  },
  {
    id: "house_apt",
    name: "아파트",
    description: "높은 곳에서 내려다보는 뷰",
    price: 200,
    requiredLevel: 4,
    sortOrder: 2,
    badge: BADGE_APT,
  },
  {
    id: "house_penthouse",
    name: "펜트하우스",
    description: "옥상 정원이 있는 럭셔리 라이프",
    price: 500,
    requiredLevel: 6,
    sortOrder: 3,
    badge: BADGE_PENTHOUSE,
  },
  {
    id: "house_castle",
    name: "성 / 궁전",
    description: "황금 프레임의 웅장한 성",
    price: 1000,
    requiredLevel: 8,
    sortOrder: 4,
    badge: BADGE_CASTLE,
  },
  {
    id: "house_space",
    name: "우주 정거장",
    description: "지구 궤도 위 최고의 집",
    price: 1500,
    requiredLevel: 10,
    sortOrder: 5,
    badge: BADGE_SPACE,
  },
];
