import basicImg from "../../assets/images/houses/house_basic.png";
import aptImg from "../../assets/images/houses/house_apt.png";
import penthouseImg from "../../assets/images/houses/house_penthouse.png";
import castleImg from "../../assets/images/houses/house_castle.png";
import spaceImg from "../../assets/images/houses/house_space.png";

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
    badge: basicImg,
  },
  {
    id: "house_apt",
    name: "아파트",
    description: "높은 곳에서 내려다보는 뷰",
    price: 200,
    requiredLevel: 4,
    sortOrder: 2,
    badge: aptImg,
  },
  {
    id: "house_penthouse",
    name: "펜트하우스",
    description: "옥상 정원이 있는 럭셔리 라이프",
    price: 500,
    requiredLevel: 6,
    sortOrder: 3,
    badge: penthouseImg,
  },
  {
    id: "house_castle",
    name: "성 / 궁전",
    description: "황금 프레임의 웅장한 성",
    price: 1000,
    requiredLevel: 8,
    sortOrder: 4,
    badge: castleImg,
  },
  {
    id: "house_space",
    name: "우주 정거장",
    description: "지구 궤도 위 최고의 집",
    price: 1500,
    requiredLevel: 10,
    sortOrder: 5,
    badge: spaceImg,
  },
];
