// 내 카드
// sticky 상태
// 상태 변경 버튼

import styled from "styled-components";
import CommunityCard from "./CommunityCard";
import { useModal } from "../../context/UIContext/ModalContext";
import { useEffect, useRef, useState } from "react";
import SelectStatusModal from "./SelectStatusModal";
import type { CommunityUser } from "../../data/mock/communityMock";

interface MyStatusSectionProps {
  myUser: CommunityUser;
  myStatus: string;
  onStatusChange: (status: string) => void;
}
const MyStatusSection = ({
  myUser,
  myStatus,
  onStatusChange,
}: MyStatusSectionProps) => {
  const { openModal, closeModal } = useModal();
  const myCardEndRef = useRef<HTMLDivElement | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const target = myCardEndRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleOpenStatusModal = () => {
    openModal({
      type: "CONFIRM",
      title: "오늘의 한마디",
      message: "",
      customContent: (
        <SelectStatusModal
          onConfirm={(status) => {
            onStatusChange(status);
            closeModal();
          }}
        />
      ),
      hideActions: true,
    });
  };

  return (
    <SectionBlock>
      <SectionHeader>내 이야기</SectionHeader>
      <CommunityCard
        user={{
          id: 0,
          nickname: "나",
          level: myUser.level,
          levelTitle: "",
          emoji: "🐣",
          status: myStatus,
          score: myUser.score,
          lastActive: Date.now() - 1000 * 60 * 2,
          badges: myUser.badges,
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
          <SelectButton onClick={handleOpenStatusModal}>
            상태 바꾸기 ✨
          </SelectButton>
        </StickyMyStatus>
      )}

      <SelectButton onClick={handleOpenStatusModal}>
        나도 한마디 선택하기 ✨
      </SelectButton>
    </SectionBlock>
  );
};

export default MyStatusSection;
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

const StickyMyStatus = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 3px 3px -3px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

  @media (min-width: 769px) {
    top: 66px;
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
