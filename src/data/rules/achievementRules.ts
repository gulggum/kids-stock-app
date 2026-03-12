//---목표 달성 보상 ---
/**
 * 🏆 업적 시스템
 * - 조건 감지
 * - 뱃지 정보
 * - 업적 전용 보상
 * /**
 * 🏅 업적 규칙
 * - 특정 조건 달성 시 지급
 * - 도전/성과 기록용

 */

export type AchievementState = {
  totalTrades: number;
  totalAsset: number;
  level: number;
  streak: number;
};

export type Achievement = {
  id: string;
  tier: "COMMON" | "RARE" | "LEGEND";
  // 🎖 뱃지 메타 정보
  badge: {
    title: string;
    description: string;
    emoji: string;
  };

  // 🎁 업적 달성 시 지급 보상
  reward: {
    coin?: number;
    exp?: number;
    score?: number;
  };

  // ✅ 달성 조건
  condition: (state: AchievementState) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  // ===============================
  // 📈 투자 관련 업적
  // ===============================

  {
    id: "FIRST_BUY",
    tier: "COMMON",
    badge: {
      title: "첫 투자",
      description: "처음으로 주식을 샀어요!",
      emoji: "🎉",
    },
    reward: { coin: 30, exp: 40 },
    condition: (state) => state.totalTrades >= 1,
  },

  {
    id: "TRADE_10",
    tier: "RARE",
    badge: {
      title: "10번 거래 달성",
      description: "주식을 10번 거래했어요!",
      emoji: "📈",
    },
    reward: { coin: 50, exp: 60 },
    condition: (state) => state.totalTrades >= 10,
  },

  // ===============================
  // 💰 자산 관련 업적
  // ===============================

  {
    id: "ASSET_120",
    tier: "RARE",
    badge: {
      title: "120만원 돌파",
      description: "총 자산이 120만원을 넘었어요!",
      emoji: "💰",
    },
    reward: { coin: 70, exp: 70 },
    condition: (state) => state.totalAsset >= 1200000,
  },

  // ===============================
  // ⭐ 레벨 업적
  // ===============================

  {
    id: "LEVEL_10",
    tier: "RARE",
    badge: {
      title: "레벨 10 달성",
      description: "투자 레벨이 10이 되었어요!",
      emoji: "⭐",
    },
    reward: { coin: 100, exp: 100 },
    condition: (state) => state.level >= 10,
  },

  // ===============================
  // 🔥 출석 업적
  // ===============================

  {
    id: "ATTEND_7_DAYS",
    tier: "COMMON",
    badge: {
      title: "일주일 개근",
      description: "7일 연속 출석 성공!",
      emoji: "🔥",
    },
    reward: { coin: 50 },
    condition: (state) => state.streak >= 7,
  },

  {
    id: "ATTEND_30_DAYS",
    tier: "LEGEND",
    badge: {
      title: "한 달 개근",
      description: "30일 연속 출석!",
      emoji: "🏆",
    },
    reward: { coin: 150 },
    condition: (state) => state.streak >= 30,
  },
];
