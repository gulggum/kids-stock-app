/**
 * 커뮤니티에 노출될 유저 정보 (더미)
 *  * 🧪 UI 테스트용 더미 유저 데이터
 * - 서버 연동 전 임시 데이터
 * - 레벨, 점수, 뱃지는 실제 로직과 무관
 */
export type CommunityUser = {
  id: number;
  nickname: string;
  level: number;
  levelTitle: string;
  emoji: string; // 캐릭터 느낌
  status: string; // 선택형 한마디
  score: number;
  badges: string[];
};

export const communityMock: CommunityUser[] = [
  {
    id: 1,
    nickname: "민수",
    level: 20,
    levelTitle: "🦊 침착한 투자자",
    emoji: "🦊",
    status: "🔥 오늘도 기록했어요!",
    score: 120,
    badges: ["FIRST_BUY"],
  },
  {
    id: 2,
    nickname: "지우",
    level: 2,
    levelTitle: "🌱 새싹 투자자",
    emoji: "🌱",
    status: "😬 처음이라 조금 떨려요",
    score: 105,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS"],
  },
  {
    id: 3,
    nickname: "현우",
    level: 30,
    levelTitle: "🦁 시장을 아는 아이",
    emoji: "🦁",
    status: "🏆 출석 7일 성공!",
    score: 50,
    badges: ["FIRST_BUY"],
  },
  {
    id: 4,
    nickname: "서연",
    level: 12,
    levelTitle: "🐰 꼼꼼한 투자자",
    emoji: "🐰",
    status: "📊 오늘은 차트 분석!",
    score: 98,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS"],
  },
  {
    id: 5,
    nickname: "준호",
    level: 15,
    levelTitle: "🐯 도전하는 투자자",
    emoji: "🐯",
    status: "💰 수익률 상승중!",
    score: 134,
    badges: ["FIRST_BUY", "ASSET_120"],
  },
  {
    id: 6,
    nickname: "하린",
    level: 9,
    levelTitle: "🐹 노력파 투자자",
    emoji: "🐹",
    status: "📚 뉴스 읽는 중!",
    score: 76,
    badges: ["FIRST_BUY"],
  },
  {
    id: 7,
    nickname: "도윤",
    level: 18,
    levelTitle: "🦉 분석가 타입",
    emoji: "🦉",
    status: "📈 오늘은 상승장!",
    score: 150,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS", "TRADE_10"],
  },
  {
    id: 8,
    nickname: "예린",
    level: 6,
    levelTitle: "🐣 새싹 도전자",
    emoji: "🐣",
    status: "🙂 한 주 샀어요!",
    score: 45,
    badges: ["FIRST_BUY"],
  },
  {
    id: 9,
    nickname: "시우",
    level: 25,
    levelTitle: "🦅 공격형 투자자",
    emoji: "🦅",
    status: "🚀 수익률 10% 달성!",
    score: 210,
    badges: ["FIRST_BUY", "ASSET_120", "LEVEL_10", "TRADE_10"],
  },
  {
    id: 10,
    nickname: "채은",
    level: 4,
    levelTitle: "🌼 투자 입문자",
    emoji: "🌼",
    status: "🌱 조금씩 배워요",
    score: 33,
    badges: [],
  },
  {
    id: 11,
    nickname: "태민",
    level: 14,
    levelTitle: "🦊 전략형 투자자",
    emoji: "🦊",
    status: "🧠 뉴스 퀴즈 성공!",
    score: 111,
    badges: ["FIRST_BUY", "ASSET_120"],
  },
  {
    id: 12,
    nickname: "유진",
    level: 8,
    levelTitle: "🐻 차분한 투자자",
    emoji: "🐻",
    status: "📅 출석 완료!",
    score: 67,
    badges: ["FIRST_BUY", "TRADE_10"],
  },
  {
    id: 13,
    nickname: "건우",
    level: 22,
    levelTitle: "🦁 성장형 투자자",
    emoji: "🦁",
    status: "🔥 오늘도 거래 성공!",
    score: 175,
    badges: ["FIRST_BUY", "LEVEL_10"],
  },
  {
    id: 14,
    nickname: "소율",
    level: 3,
    levelTitle: "🌷 시작하는 투자자",
    emoji: "🌷",
    status: "🙂 아직 배우는 중",
    score: 22,
    badges: [],
  },
  {
    id: 15,
    nickname: "이든",
    level: 17,
    levelTitle: "🐺 집중형 투자자",
    emoji: "🐺",
    status: "📊 오늘은 하락장 분석!",
    score: 140,
    badges: ["FIRST_BUY", "ATTEND_7_DAYS"],
  },
];
