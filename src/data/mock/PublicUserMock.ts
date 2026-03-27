import type { ProfileAvatarType } from "../static/profileAvatars";

/**
 * 🧪 커뮤니티 UI 테스트용 더미 유저 데이터
 *
 * - 서버 연동 전 임시 데이터
 * - 레벨/타이틀은 levelTitles.ts 기준에 맞춤
 *
 * 레벨 타이틀 기준
 * level 1  → 🐣 투자 새싹
 * level 2  → 🌱 배우는 투자자
 * level 3  → 🐥 도전하는 투자자
 * level 4  → 🦊 똑똑한 투자자
 * level 5  → 🐯 용감한 투자자
 * level 6  → 🦁 자신있는 투자자
 * level 7  → 🦅 날카로운 투자자
 * level 8  → 🌟 빛나는 투자자
 * level 9  → 💎 다이아 투자자
 * level 10 → 👑 투자 마스터
 *
 * TODO: Supabase 연동 시 전체 제거 후 API로 대체
 */

export type PublicUser = {
  id: number;
  nickname: string;
  level: number;
  levelTitle: string;
  emoji: string; // 캐릭터 느낌
  status: string; // 선택형 한마디
  score: number;
  lastActive: number;
  badges: string[];
  profileImage: string | null; //사진첩등..url
  profileAvatar: ProfileAvatarType | null; //기본캐릭터 (좌표로 적용 SpriteAvater사용)
};

export const publicUserMock: PublicUser[] = [
  {
    id: 1,
    nickname: "민수",
    level: 1,
    levelTitle: "🐣 투자 새싹",
    emoji: "🐣",
    status: "🙂 오늘 처음 시작했어요!",
    score: 10,
    lastActive: Date.now() - 1000 * 60 * 5,
    badges: [],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 2,
    nickname: "지우",
    level: 2,
    levelTitle: "🌱 배우는 투자자",
    emoji: "🌱",
    status: "😬 처음이라 조금 떨려요",
    score: 60,
    lastActive: Date.now() - 1000 * 60 * 2,
    badges: ["FIRST_BUY"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 3,
    nickname: "현우",
    level: 2,
    levelTitle: "🌱 배우는 투자자",
    emoji: "🌱",
    status: "📚 뉴스 읽는 중!",
    score: 80,
    lastActive: Date.now() - 1000 * 60 * 30,
    badges: ["FIRST_BUY"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 4,
    nickname: "서연",
    level: 3,
    levelTitle: "🐥 도전하는 투자자",
    emoji: "🐥",
    status: "📊 오늘은 차트 분석!",
    score: 98,
    lastActive: Date.now() - 1000 * 60 * 2,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 5,
    nickname: "준호",
    level: 3,
    levelTitle: "🐥 도전하는 투자자",
    emoji: "🐥",
    status: "💰 수익률 상승중!",
    score: 120,
    lastActive: Date.now() - 1000 * 60 * 10,
    badges: ["FIRST_BUY"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 6,
    nickname: "하린",
    level: 4,
    levelTitle: "🦊 똑똑한 투자자",
    emoji: "🦊",
    status: "🧠 뉴스 퀴즈 성공!",
    score: 145,
    lastActive: Date.now() - 1000 * 60 * 2,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 7,
    nickname: "도윤",
    level: 4,
    levelTitle: "🦊 똑똑한 투자자",
    emoji: "🦊",
    status: "📈 오늘은 상승장!",
    score: 160,
    lastActive: Date.now() - 1000 * 60 * 10,
    badges: ["FIRST_BUY", "TRADE_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 8,
    nickname: "예린",
    level: 5,
    levelTitle: "🐯 용감한 투자자",
    emoji: "🐯",
    status: "🔥 오늘도 기록했어요!",
    score: 200,
    lastActive: Date.now() - 1000 * 60 * 2,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 9,
    nickname: "태민",
    level: 5,
    levelTitle: "🐯 용감한 투자자",
    emoji: "🐯",
    status: "💪 꾸준히 하는 중!",
    score: 220,
    lastActive: Date.now() - 1000 * 60 * 15,
    badges: ["FIRST_BUY", "ASSET_120"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 10,
    nickname: "채은",
    level: 6,
    levelTitle: "🦁 자신있는 투자자",
    emoji: "🦁",
    status: "🚀 수익률 5% 달성!",
    score: 280,
    lastActive: Date.now() - 1000 * 60 * 10,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "TRADE_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 11,
    nickname: "유진",
    level: 6,
    levelTitle: "🦁 자신있는 투자자",
    emoji: "🦁",
    status: "📅 출석 완료!",
    score: 300,
    lastActive: Date.now() - 1000 * 60 * 5,
    badges: ["FIRST_BUY", "ASSET_120"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 12,
    nickname: "건우",
    level: 7,
    levelTitle: "🦅 날카로운 투자자",
    emoji: "🦅",
    status: "📊 오늘은 하락장 분석!",
    score: 350,
    lastActive: Date.now() - 1000 * 60 * 2,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "TRADE_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 13,
    nickname: "소율",
    level: 7,
    levelTitle: "🦅 날카로운 투자자",
    emoji: "🦅",
    status: "🔥 오늘도 거래 성공!",
    score: 380,
    lastActive: Date.now() - 1000 * 60 * 20,
    badges: ["FIRST_BUY", "LEVEL_10", "TRADE_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 14,
    nickname: "이든",
    level: 8,
    levelTitle: "🌟 빛나는 투자자",
    emoji: "🌟",
    status: "✨ 레벨 8 달성!",
    score: 430,
    lastActive: Date.now() - 1000 * 60 * 2,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "ASSET_120"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 15,
    nickname: "나연",
    level: 8,
    levelTitle: "🌟 빛나는 투자자",
    emoji: "🌟",
    status: "💎 꾸준함이 최고!",
    score: 460,
    lastActive: Date.now() - 1000 * 60 * 8,
    badges: ["FIRST_BUY", "TRADE_10", "LEVEL_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 16,
    nickname: "시우",
    level: 9,
    levelTitle: "💎 다이아 투자자",
    emoji: "💎",
    status: "🚀 수익률 10% 달성!",
    score: 520,
    lastActive: Date.now() - 1000 * 60 * 3,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "ASSET_120", "TRADE_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 17,
    nickname: "아린",
    level: 9,
    levelTitle: "💎 다이아 투자자",
    emoji: "💎",
    status: "📈 지금이 기회야!",
    score: 550,
    lastActive: Date.now() - 1000 * 60 * 12,
    badges: ["FIRST_BUY", "LEVEL_10", "ASSET_120"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 18,
    nickname: "재원",
    level: 10,
    levelTitle: "👑 투자 마스터",
    emoji: "👑",
    status: "👑 드디어 마스터!",
    score: 620,
    lastActive: Date.now() - 1000 * 60 * 2,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "ASSET_120", "TRADE_10", "LEVEL_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 19,
    nickname: "하은",
    level: 10,
    levelTitle: "👑 투자 마스터",
    emoji: "👑",
    status: "💰 레전드 카드 획득!",
    score: 680,
    lastActive: Date.now() - 1000 * 60 * 5,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "ASSET_120", "TRADE_10", "LEVEL_10"],
    profileImage: null,
    profileAvatar: null,
  },
  {
    id: 20,
    nickname: "희연",
    level: 10,
    levelTitle: "👑 투자 마스터",
    emoji: "👑",
    status: "🏆 투자 마스터 등극!",
    score: 750,
    lastActive: Date.now() - 1000 * 60 * 1,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "ASSET_120", "TRADE_10", "LEVEL_10"],
    profileImage: null,
    profileAvatar: null,
  },
];
