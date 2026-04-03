import styled from "styled-components";
import { useEffect, useState } from "react";
import { useAchievement } from "../context/AchievementContext";
import MyStatusSection from "../components/community/MyStatusSection";
import CommunityRanking from "../components/community/CommunityRanking";
import CommunityFeed from "../components/community/CommunityFeed";
import MyFriendsSection from "../components/community/MyFriendsSection";
import SuggestionSection from "../components/community/SuggestionSection";
import { useUser } from "../context/UserContext";
import { getStorage, setStorage } from "../utils/storage";
import { useRankingQuery } from "../hooks/useRankingQuery";
import type { PublicUser } from "../types/UserType";
import CommunityRankingSkeleton from "../components/community/CommunityRankingSkeleton";

/**
 * 커뮤니티 메인 화면
 * - 유저 간 소통이 아니라 "함께 하고 있다는 느낌"을 주는 공간
 */

const Community = () => {
  const { achieved } = useAchievement();
  const { user, updateStatus } = useUser();
  const { data: rankingUsers, isLoading: rankingLoading } = useRankingQuery();

  // ✅ 변경 - User → RankingUser로 변환 후 넣기
  const myRankingUser: PublicUser = {
    id: user.id,
    nickname: user.nickname,
    level: user.level,
    score: user.score,
    badges: user.badges,
    profileImage: user.profileImage,
    profileAvatar: user.profileAvatar,
    emoji: "🙂",
    status: user.status,
    lastActive: Date.now(), // — 나는 지금 온라인이니까 현재 시간
  };

  // 🔥 전체 유저 리스트 ( // ✅ 내 정보 + Supabase 유저들 합치기
  // 단, 내가 이미 목록에 있으면 중복 제거)
  const allUsers = rankingUsers
    ? [myRankingUser, ...rankingUsers.filter((u) => u.id !== user.id)] //내정보 중복제거
    : [myRankingUser];
  // 🔥 친구 상태
  const [friends, setFriends] = useState<string[]>(() => {
    const stored = getStorage("myFriends", []);
    // 혹시 string으로 잘못 저장된 경우 방어
    return Array.isArray(stored) ? stored : [];
  });

  // 🔥 저장 동기화
  useEffect(() => {
    setStorage("myFriends", friends);
  }, [friends]);

  // 🔥 토글 함수 (핵심)
  const handleToggleFriend = (userId: string) => {
    setFriends((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <Wrapper>
      <Title>📢 오늘의 투자 광장</Title>
      <Description>다른 친구들은 이렇게 활동하고 있어요 😊</Description>

      {/* ⭐ 내 카드 섹션 */}
      <MyStatusSection myStatus={user.status} onStatusChange={updateStatus} />

      {/* 🏆 랭킹 섹션 */}
      {rankingLoading ? (
        <CommunityRankingSkeleton />
      ) : (
        <CommunityRanking
          allUsers={allUsers}
          myUserId={user.id}
          myScore={user.score}
          myAchievedCount={achieved.length}
        />
      )}

      {/* 👥 내친구 섹션 */}
      <MyFriendsSection
        users={allUsers}
        friends={friends}
        onToggleFriend={handleToggleFriend}
      />
      {/* 👥 친구추천 섹션 */}
      <SuggestionSection
        users={allUsers}
        friends={friends}
        onToggleFriend={handleToggleFriend}
      />

      {/* 👥 친구 피드 섹션 */}
      <CommunityFeed
        users={allUsers}
        friends={friends}
        onToggleFriend={handleToggleFriend}
      />
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
  overflow-x: hidden;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 900;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: -6px;
`;
