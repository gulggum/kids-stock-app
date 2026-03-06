import styled from "styled-components";
import { communityMock, type CommunityUser } from "../data/mock/communityMock";
import { useEffect, useState } from "react";
import { useAchievement } from "../context/AchievementContext/AchievementContext";
import { useCharacter } from "../context/UserContext/CharacterContext";
import { useScore } from "../context/ScoreContext";
import MyStatusSection from "../components/community/MyStatusSection";
import CommunityRanking from "../components/community/CommunityRanking";
import CommunityFeed from "../components/community/CommunityFeed";

/**
 * 커뮤니티 메인 화면
 * - 유저 간 소통이 아니라 "함께 하고 있다는 느낌"을 주는 공간
 */

const Community = () => {
  const { achieved } = useAchievement();
  const { character } = useCharacter();
  const { score } = useScore();

  const [myStatus, setMyStatus] = useState(() => {
    const saved = localStorage.getItem("myStatus");
    return saved ?? "😄 오늘도 참여했어요!";
  });

  useEffect(() => {
    localStorage.setItem("myStatus", myStatus);
  }, [myStatus]);

  // 🔥 내 유저 데이터 구성
  const myUser: CommunityUser = {
    id: 0,
    nickname: "나",
    level: character.level,
    emoji: "🐣",
    score,
    lastActive: Date.now() - 1000 * 60 * 10,
    badges: achieved,
    levelTitle: "",
    status: "",
  };

  // 🔥 전체 유저 리스트 (내 정보 + mock)
  const allUsers = [myUser, ...communityMock];

  return (
    <Wrapper>
      <Title>📢 오늘의 투자 광장</Title>
      <Description>다른 친구들은 이렇게 활동하고 있어요 😊</Description>

      {/* ⭐ 내 카드 섹션 */}
      <MyStatusSection
        myUser={myUser}
        myStatus={myStatus}
        onStatusChange={setMyStatus}
      />

      {/* 🏆 랭킹 섹션 */}
      <CommunityRanking
        allUsers={allUsers}
        myUserId={myUser.id}
        myScore={score}
        myAchievedCount={achieved.length}
      />

      {/* 👥 친구 피드 섹션 */}
      <CommunityFeed users={communityMock} />
    </Wrapper>
  );
};

export default Community;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 80px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 900;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;
