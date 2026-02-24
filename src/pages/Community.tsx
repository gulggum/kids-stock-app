import styled from "styled-components";
import { communityMock } from "../data/mock/communityMock";
import CommunityCard from "../components/community/CommunityCard";
import { useModal } from "../context/UIContext/ModalContext";
import { useEffect, useState } from "react";
import SelectStatusModal from "../components/community/SelectStatusModal";
import { useRef } from "react";
import { useAchievement } from "../context/AchievementContext/AchievementContext";
import { useCharacter } from "../context/UserContext/CharacterContext";
import { useScore } from "../context/ScoreContext";

/**
 * 커뮤니티 메인 화면
 * - 유저 간 소통이 아니라 "함께 하고 있다는 느낌"을 주는 공간
 */

const Community = () => {
  const { openModal, closeModal } = useModal();
  const { achieved } = useAchievement();
  const { character } = useCharacter();
  const { score } = useScore();
  //"내 카드의 끝"을 감지하는 더미 div
  const myCardEndRef = useRef<HTMLDivElement | null>(null);
  // 실제 커뮤니티에 표시되는 상태
  const [myStatus, setMyStatus] = useState("😄 오늘도 참여했어요!");

  const [showSticky, setShowSticky] = useState(false);

  const [rankingType, setRankingType] = useState<"SCORE" | "ACHIEVEMENT">(
    "SCORE",
  );
  // 🔥 내 유저 데이터 구성
  const myUser = {
    id: 0,
    nickname: "나",
    level: character.level,
    emoji: "🐣",
    score,
    badges: achieved,
  };

  // 🔥 전체 유저 리스트 (내 정보 + mock)
  const allUsers = [myUser, ...communityMock];
  //점수 기준 정렬
  const scoreRanking = [...allUsers].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );
  // 🏅 업적 개수 기준 정렬
  const achievementRanking = [...allUsers].sort(
    (a, b) => (b.badges?.length ?? 0) - (a.badges?.length ?? 0),
  );

  const rankingList =
    rankingType === "SCORE" ? scoreRanking : achievementRanking;

  useEffect(() => {
    const target = myCardEndRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 내 카드가 화면에 안 보이면 sticky 표시
        setShowSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <Wrapper>
      <Title>📢 오늘의 투자 광장</Title>
      <Description>다른 친구들은 이렇게 활동하고 있어요 😊</Description>
      {/* ⭐ 내 카드 (고정) */}
      <SectionBlock>
        <SectionHeader>내 이야기</SectionHeader>
        <CommunityCard
          user={{
            id: 0,
            nickname: "나",
            level: character.level,
            levelTitle: "",
            emoji: "🐣",
            status: myStatus,
            score: 120,
            badges: achieved,
          }}
        />
        {/* 👀 이 div가 사라질 때 sticky 등장 */}
        <div ref={myCardEndRef} />
        {/* 📌 sticky 요약바 (조건부 렌더링) */}
        {showSticky && (
          <StickyMyStatus>
            <MyStatusRow>
              <StatusEmoji>🧍</StatusEmoji>
              <MyStatusText>{myStatus}</MyStatusText>
            </MyStatusRow>

            <SelectButton
              onClick={() =>
                openModal({
                  type: "CONFIRM",
                  title: "오늘의 한마디",
                  message: "",
                  customContent: (
                    <SelectStatusModal
                      onConfirm={(status) => {
                        setMyStatus(status); //즉시반영
                        closeModal();
                      }}
                    />
                  ),
                  hideActions: true,
                })
              }
            >
              상태 바꾸기 ✨
            </SelectButton>
          </StickyMyStatus>
        )}

        <SelectButton
          onClick={() =>
            openModal({
              type: "CONFIRM",
              title: "오늘의 한마디",
              message: "",
              customContent: (
                <SelectStatusModal
                  onConfirm={(status) => {
                    setMyStatus(status); //즉시반영
                    closeModal();
                  }}
                />
              ),
              hideActions: true,
            })
          }
        >
          나도 한마디 선택하기 ✨
        </SelectButton>
      </SectionBlock>
      {/* 🏆 이번 주 랭킹 */}
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
            const isMe = user.id === 0;

            return (
              <RankingRow key={user.id} $isMe={isMe}>
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
          {(() => {
            const myIndex = rankingList.findIndex((u) => u.id === 0);
            if (myIndex === -1) return null;

            const myRank = myIndex + 1;

            return (
              <>
                📍 내 순위 {myRank}등{"  |  "}
                {rankingType === "SCORE"
                  ? `${score}점`
                  : `${achieved.length}개`}
              </>
            );
          })()}
        </MyRankSticky>
      </SectionBlock>
      {/* 👥 다른 친구들 */}
      <SectionBlock>
        <SectionTitle>친구들은 이렇게 하고 있어요</SectionTitle>
        <List>
          {communityMock.map((user) => (
            <CommunityCard key={user.id} user={user} />
          ))}
        </List>
      </SectionBlock>
    </Wrapper>
  );
};

export default Community;

/* ================= 스타일 ================= */

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;
const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 900;
`;
const SectionBlock = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.h3`
  font-size: 15px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.3px;

  display: flex;
  align-items: center;
  gap: 6px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.muted};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const SelectButton = styled.button`
  padding: 14px;

  border-radius: ${({ theme }) => theme.radius.lg};
  border: none;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  font-size: 14px;
  font-weight: 900;
  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
`;

//스크롤시 고정될 내 상태 요약
const StickyMyStatus = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;

  width: 100%;
  margin: 0 -16px -16px 0; /* 패딩 상쇄 */
  padding: 12px 0;

  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 3px 3px -3px rgba(0, 0, 0, 0.12);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  /* 등장 애니메이션 */
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const MyStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const StatusEmoji = styled.div`
  font-size: 16px;
`;

const MyStatusText = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

//랭킹

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
    $active ? theme.colors.primary : "#eee"};

  color: ${({ $active }) => ($active ? "#fff" : "#555")};

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
  background: ${({ $rank }) =>
    $rank === 0 ? "#ffe066" : $rank === 1 ? "#e0e0e0" : "#ffd8a8"};
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  transform: ${({ $rank }) => ($rank === 0 ? "scale(1.05)" : "scale(1)")};
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
  background: #fff9db;
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
