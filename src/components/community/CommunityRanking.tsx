import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import type { PublicUser } from "../../types/UserType";
import avatarSprite from "../../assets/avatars/avatarSprite.png";

//`Pick`을 쓰면 `PublicUser`에서 필요한 필드만 뽑아서 `RankingUser`를 만들 수 있어요. 나중에 `PublicUser`에 필드 추가해도 `RankingUser`는 자동으로 안 따라와서 안전
// 📌 TODO: Supabase 연동 시
// GET /api/ranking 응답 타입과 맞출 것
// 현재는 communityMock(PublicUser)에서 Pick으로 추출해서 사용
// 연동 후엔 이 타입이 그대로 API 응답 타입이 됨
// ─────────────────────────────────────────

interface CommunityRankingProps {
  allUsers: PublicUser[];
  myUserId: string;
  myScore: number;
  myAchievedCount: number;
}

const CommunityRanking = ({
  allUsers,
  myUserId,
  myScore,
  myAchievedCount,
}: CommunityRankingProps) => {
  const myRankRef = useRef<HTMLDivElement | null>(null);
  const [rankingType, setRankingType] = useState<"SCORE" | "ACHIEVEMENT">(
    "SCORE",
  );

  // 점수 기준 정렬
  const scoreRanking = [...allUsers].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );

  // 업적 개수 기준 정렬
  const achievementRanking = [...allUsers].sort(
    (a, b) => (b.badges?.length ?? 0) - (a.badges?.length ?? 0),
  );

  const rankingList =
    rankingType === "SCORE" ? scoreRanking : achievementRanking;

  // 내 순위로 자동 스크롤
  useEffect(() => {
    const myIndex = rankingList.findIndex((u) => u.id === myUserId);
    if (myIndex > 2) {
      setTimeout(() => {
        myRankRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    }
  }, [rankingType]);

  const myRank = rankingList.findIndex((u) => u.id === myUserId) + 1;

  return (
    <SectionBlock>
      <SectionTitle>🏆 이번 주 랭킹</SectionTitle>

      <RankingTabWrapper>
        <RankingTab
          $active={rankingType === "SCORE"}
          onClick={() => setRankingType("SCORE")}
        >
          🏆 활동 랭킹
        </RankingTab>
        <RankingTab
          $active={rankingType === "ACHIEVEMENT"}
          onClick={() => setRankingType("ACHIEVEMENT")}
        >
          🏅 업적 랭킹
        </RankingTab>
      </RankingTabWrapper>

      {/* 🔥 TOP 3 영역 */}
      <TopThreeWrapper>
        {[0, 1, 2].map((index) => {
          const user = rankingList[index];
          return (
            <TopCard key={index} $rank={index}>
              <Medal>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</Medal>
              {user ? (
                <>
                  {/* ✅ 프로필 이미지 → 아바타 → 이모지 순서로 */}
                  <TopAvatarWrapper>
                    {user.profileImage ? (
                      <TopAvatarImg src={user.profileImage} />
                    ) : user.profileAvatar ? (
                      <TopSprite
                        $x={user.profileAvatar.x}
                        $y={user.profileAvatar.y}
                      />
                    ) : (
                      <TopEmoji>{user.emoji}</TopEmoji>
                    )}
                  </TopAvatarWrapper>
                  <TopName>{user.nickname}</TopName>
                  <TopScore>
                    {rankingType === "SCORE"
                      ? `${user.score ?? 0}점`
                      : `${user.badges?.length ?? 0}개`}
                  </TopScore>
                </>
              ) : (
                <>
                  <EmptyEmoji>👤</EmptyEmoji>
                  <EmptyName>???</EmptyName>
                  <EmptyScore>-</EmptyScore>
                </>
              )}
            </TopCard>
          );
        })}
      </TopThreeWrapper>

      {/* 🔥 4등 이후 리스트 */}
      <RankingList>
        {rankingList.slice(3).length === 0 ? (
          // ✅ 4등 이하 유저 없으면 안내 문구
          <EmptyList>아직 참여한 친구가 없어요 👀</EmptyList>
        ) : (
          rankingList.slice(3).map((user, index) => {
            const actualRank = index + 4;
            const isMe = user.id === myUserId;
            return (
              <RankingRow
                key={user.id}
                ref={isMe ? myRankRef : null}
                $isMe={isMe}
              >
                <RankNumber>{actualRank}</RankNumber>
                <UserInfo>
                  <UserEmoji>{user.emoji}</UserEmoji>
                  <UserName>{user.nickname}</UserName>
                  <LevelText>Lv.{user.level}</LevelText>
                </UserInfo>
                <Score>
                  {rankingType === "SCORE"
                    ? `${user.score ?? 0}점`
                    : `${user.badges?.length ?? 0}개`}
                </Score>
              </RankingRow>
            );
          })
        )}
      </RankingList>

      {/* 📌 내 순위 sticky */}
      <MyRankSticky>
        {myRank > 0 && (
          <>
            📍 내 순위 {myRank}등{" | "}
            {rankingType === "SCORE" ? `${myScore}점` : `${myAchievedCount}개`}
          </>
        )}
      </MyRankSticky>
    </SectionBlock>
  );
};

export default CommunityRanking;

/* ================= 스타일 ================= */

const SectionBlock = styled.section`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;
`;

const RankingTabWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const RankingTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background};

  color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.text)};
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const TopThreeWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  gap: 12px;
  margin-bottom: 24px;
`;

const TopCard = styled.div<{ $rank: number }>`
  width: calc(33% - 8px);
  flex: 1;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* ✅ 세련된 카드 */
  background: ${({ $rank }) =>
    $rank === 0
      ? "linear-gradient(145deg, #FFF8DC, #F5E642)" // 골드
      : $rank === 1
        ? "linear-gradient(145deg, #F0F0F0, #C8C8C8)" // 실버
        : "linear-gradient(145deg, #FFE0C0, #D4874E)"}; // 브론즈

  border: 1px solid
    ${({ $rank }) =>
      $rank === 0 ? "#E8C800" : $rank === 1 ? "#B0B0B0" : "#C06020"};

  box-shadow: ${({ $rank }) =>
    $rank === 0
      ? "0 4px 12px rgba(232,200,0,0.3)"
      : $rank === 1
        ? "0 4px 12px rgba(0,0,0,0.1)"
        : "0 4px 12px rgba(192,96,32,0.3)"};

  background-repeat: no-repeat;
`;

const Medal = styled.div`
  font-size: 20px;
  margin-bottom: 4px;
`;

const TopEmoji = styled.div`
  font-size: 28px;
`;

const TopName = styled.div`
  font-weight: bold;
  margin-top: 4px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
`;

const TopScore = styled.div`
  font-size: 14px;
  margin-top: 6px;
  color: #444;
`;

const RankingList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
`;

const RankingRow = styled.div<{ $isMe?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px;
  border-radius: 12px;
  margin-bottom: 8px;
  background: ${({ $isMe }) => ($isMe ? "#fff3bf" : "#f7f7f7")};

  transition: 0.2s;
  &:hover {
    background: #ececec;
    cursor: pointer;
  }
`;

const RankNumber = styled.div`
  width: 28px;
  font-weight: bold;
  text-align: center;
`;

const MyRankSticky = styled.div`
  position: sticky;
  bottom: 0;

  padding: 12px;
  border-top: 2px solid #ffd43b;
  font-weight: bold;
  text-align: center;
  margin-top: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const UserEmoji = styled.div`
  font-size: 20px;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const LevelText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Score = styled.div`
  font-size: 14px;
  font-weight: 800;
`;
const EmptyEmoji = styled.div`
  font-size: 28px;
  opacity: 0.25;
`;

const EmptyName = styled.div`
  font-weight: bold;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.muted};
  opacity: 0.4;
`;

const EmptyScore = styled.div`
  font-size: 14px;
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.muted};
  opacity: 0.4;
`;

const EmptyList = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;
const TopAvatarWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  flex-shrink: 0;
`;

const TopAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TopSprite = styled.div<{ $x: number; $y: number }>`
  width: 100%;
  height: 100%;
  background-image: url(${avatarSprite});
  background-size: 500% 300%;
  background-position: ${({ $x, $y }) =>
    `${($x / 3.8999) * 100}% ${($y / 2) * 100}%`};
`;
