// 내 카드
// sticky 상태
// 상태 변경 버튼

import styled from "styled-components";
import CommunityCard from "./CommunityCard";
import { useModal } from "../../context/UIContext/ModalContext";
import { useEffect, useRef, useState } from "react";
import SelectStatusModal from "./SelectStatusModal";
import { useAchievement } from "../../context/AchievementContext";
import { useUser } from "../../context/UserContext";
import avatarSprite from "../../assets/avatars/avatarSprite.png";

interface MyStatusSectionProps {
  myStatus: string;
  onStatusChange: (status: string) => void;
}
const MyStatusSection = ({
  myStatus,
  onStatusChange,
}: MyStatusSectionProps) => {
  const { openModal, closeModal } = useModal();
  const myCardEndRef = useRef<HTMLDivElement | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const { achieved } = useAchievement();
  const { user } = useUser();

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
          id: user.id,
          nickname: user.nickname,
          level: user.level,
          emoji: "🐣", // TODO: Supabase 연동 시 제거, profileImage/profileAvatar 사용 예정
          status: myStatus,
          score: user.score,
          lastActive: Date.now() - 1000 * 60 * 2,
          badges: achieved,
          profileImage: user.profileImage,
          profileAvatar: user.profileAvatar ?? null,
          selectedSkin: user.selectedSkin ?? "basic",
          equippedHouseId: user.equippedHouseId ?? "house_basic",
          villageX: null,
          villageY: null,
        }}
      />

      {/* 👀 이 div가 사라질 때 sticky 등장 */}
      <div ref={myCardEndRef} />

      {/* 📌 sticky 요약바 (조건부 렌더링) */}
      {showSticky && (
        <StickyMyStatus>
          <MyStatusRow>
            {/* ✅ 이모지 → 아바타 사진으로 교체 */}
            <StickyAvatar>
              {user.profileImage ? (
                <StickyAvatarImg src={user.profileImage} />
              ) : user.profileAvatar ? (
                <StickySprite
                  $x={user.profileAvatar.x}
                  $y={user.profileAvatar.y}
                />
              ) : (
                <StickyEmoji>🙂</StickyEmoji>
              )}
            </StickyAvatar>
            <MyStatusText>{myStatus}</MyStatusText>
          </MyStatusRow>
          <StickyButton onClick={handleOpenStatusModal}>
            나도 한마디 선택하기 ✨
          </StickyButton>
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
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.md};

  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const SectionHeader = styled.h3`
  font-size: 15px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.3px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;

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
  max-width: 1024px;
  margin: 0 auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
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
    top: 60px;
  }
`;

const MyStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const StickyAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.background};
`;

const StickyAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StickySprite = styled.div<{ $x: number; $y: number }>`
  width: 100%;
  height: 100%;
  background-image: url(${avatarSprite});
  background-size: 500% 300%;
  background-position: ${({ $x, $y }) =>
    `${($x / 3.8999) * 100}% ${($y / 2) * 100}%`};
`;

const StickyEmoji = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;
const MyStatusText = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StickyButton = styled.button`
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
`;
