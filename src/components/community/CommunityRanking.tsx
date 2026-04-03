import styled from "styled-components";
import { type PublicUser } from "../../data/mock/PublicUserMock";
import { useEffect, useRef, useState } from "react";
import rankBg from "../../assets/images/rankBg.png";

//`Pick`을 쓰면 `PublicUser`에서 필요한 필드만 뽑아서 `RankingUser`를 만들 수 있어요. 나중에 `PublicUser`에 필드 추가해도 `RankingUser`는 자동으로 안 따라와서 안전
// 📌 TODO: Supabase 연동 시
// GET /api/ranking 응답 타입과 맞출 것
// 현재는 communityMock(PublicUser)에서 Pick으로 추출해서 사용
// 연동 후엔 이 타입이 그대로 API 응답 타입이 됨
// ─────────────────────────────────────────
export type RankingUser = Pick<
  PublicUser,
  | "id"
  | "nickname"
  | "level"
  | "score"
  | "badges"
  | "profileImage"
  | "profileAvatar"
  | "emoji" //  TODO: Supabase 연동 시 제거 / 현재는 UI 확인용 임시 이모지
>;

interface CommunityRankingProps {
  allUsers: RankingUser[];
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
        {rankingList.slice(0, 3).map((user, index) => (
          <TopCard key={user.id} $rank={index}>
            <Medal>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</Medal>
            <TopEmoji>{user.emoji}</TopEmoji>
            <TopName>{user.nickname}</TopName>
            <TopScore>
              {rankingType === "SCORE"
                ? `${user.score ?? 0}점`
                : `${user.badges?.length ?? 0}개`}
            </TopScore>
          </TopCard>
        ))}
      </TopThreeWrapper>

      {/* 🔥 4등 이후 리스트 */}
      <RankingList>
        {rankingList.slice(3).map((user, index) => {
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
        })}
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
  flex: 1;
  padding: 16px;
  border-radius: 16px;
  text-align: center;
  background-image: url(${rankBg});
  background-position: ${({ $rank }) =>
    $rank === 0 ? "top" : $rank === 1 ? "center" : "bottom"};

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
