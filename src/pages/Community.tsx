import styled from "styled-components";
import { communityMock } from "../data/mock/communityMock";
import CommunityCard from "../components/community/communityCard";
import { useModal } from "../context/UIContext/ModalContext";
import { useEffect, useState } from "react";
import SelectStatusModal from "../components/community/SelectStatusModal";
import type { BadgeId } from "../data/static/badges";
import { useRef } from "react";

/**
 * 커뮤니티 메인 화면
 * - 유저 간 소통이 아니라 "함께 하고 있다는 느낌"을 주는 공간
 */

const rankingMock = [
  { id: 1, nickname: "민준", level: 28, emoji: "🦁", score: 120 },
  { id: 2, nickname: "서연", level: 22, emoji: "🦊", score: 98 },
  { id: 3, nickname: "지훈", level: 18, emoji: "🐯", score: 85 },
];
const Community = () => {
  const { openModal, closeModal } = useModal();
  //"내 카드의 끝"을 감지하는 더미 div
  const myCardEndRef = useRef<HTMLDivElement | null>(null);
  // 실제 커뮤니티에 표시되는 상태
  const [myStatus, setMyStatus] = useState("😄 오늘도 참여했어요!");

  const [showSticky, setShowSticky] = useState(false);

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
      <SectionTitle>내 이야기</SectionTitle>
      <CommunityCard
        user={{
          id: 0,
          nickname: "나",
          level: 12,
          levelTitle: "🐣 도전하는 투자자",
          emoji: "🐣",
          status: myStatus,
          badges: [
            "FIRST_BUY",
            "DAILY_ONCE",
            "WEEK_3",
            "QUIZ_MASTER",
            "LEVEL_10",
          ] as BadgeId[],
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
      {/* 🏆 이번 주 랭킹 */}
      <SectionTitle>🏆 이번 주 랭킹</SectionTitle>

      <RankingCard>
        {rankingMock.map((user, index) => (
          <RankingRow key={user.id}>
            <Rank>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</Rank>

            <UserInfo>
              <UserEmoji>{user.emoji}</UserEmoji>
              <UserName>{user.nickname}</UserName>
              <LevelText>Lv.{user.level}</LevelText>
            </UserInfo>

            <Score>{user.score}점</Score>
          </RankingRow>
        ))}
      </RankingCard>

      {/* 👥 다른 친구들 */}
      <SectionTitle>친구들은 이렇게 하고 있어요</SectionTitle>
      <List>
        {communityMock.map((user) => (
          <CommunityCard key={user.id} user={user} />
        ))}
      </List>
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
const RankingCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RankingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Rank = styled.div`
  font-size: 20px;
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
