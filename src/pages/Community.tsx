import styled from "styled-components";
import { communityMock } from "../data/communityMock";
import CommunityCard from "../components/community/communityCard";
import { useModal } from "../context/ModalContext";
import { useState } from "react";
import SelectStatusModal from "../components/community/SelectStatusModal";
import type { BadgeId } from "../data/badges";

/**
 * 커뮤니티 메인 화면
 * - 유저 간 소통이 아니라 "함께 하고 있다는 느낌"을 주는 공간
 */
const Community = () => {
  const { openModal, closeModal } = useModal();

  // 실제 커뮤니티에 표시되는 상태
  const [myStatus, setMyStatus] = useState("😄 오늘도 참여했어요!");

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
          badges: ["FIRST_BUY"] as BadgeId[],
        }}
      />

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
            //확인 버튼 눌렀을 때만 실제반영
            onConfirm: () => {
              closeModal();
            },
            //취소시 임시 상태 초기화
            onCancel: () => {
              closeModal();
            },
          })
        }
      >
        나도 한마디 선택하기 ✨
      </SelectButton>

      {/* 👥 다른 친구들 */}
      <SectionTitle>친구들은 이렇게 하고 있어요</SectionTitle>
      <List>
        {communityMock.map((user) => (
          <CommunityCard key={user.id} user={user} />
        ))}
      </List>

      {/* 다음 단계용 버튼 */}
      <SelectButton>나도 한마디 선택하기 ✨</SelectButton>
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
  margin-top: 8px;
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
