/**
 * 커뮤니티에 노출될 유저 정보 (더미)
 * - 실제 유저 데이터가 아니라 UI용 mock
 */
export type CommunityUser = {
  id: number;
  nickname: string;
  level: number;
  levelTitle: string;
  emoji: string; // 캐릭터 느낌
  status: string; // 선택형 한마디
};

export const communityMock: CommunityUser[] = [
  {
    id: 1,
    nickname: "민수",
    level: 20,
    levelTitle: "🦊 침착한 투자자",
    emoji: "🦊",
    status: "🔥 오늘도 기록했어요!",
  },
  {
    id: 2,
    nickname: "지우",
    level: 2,
    levelTitle: "🌱 새싹 투자자",
    emoji: "🌱",
    status: "😬 처음이라 조금 떨려요",
  },
  {
    id: 3,
    nickname: "현우",
    level: 30,
    levelTitle: "🦁 시장을 아는 아이",
    emoji: "🦁",
    status: "🏆 출석 7일 성공!",
  },
];
