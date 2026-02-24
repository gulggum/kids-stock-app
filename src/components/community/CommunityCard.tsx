import styled, { css, keyframes } from "styled-components";
import { type CommunityUser } from "../../data/mock/communityMock";
import { useModal } from "../../context/UIContext/ModalContext";
import BadgeListModal from "./BadgeListModal";
import { ACHIEVEMENTS } from "../../data/rules/achievementRules";
import { getLevelTier } from "../../utils/getLevelTier";

/**
 * 커뮤니티에 보여지는 유저 카드
 * - 말 없이도 "누가 활동 중인지" 보여주는 용도
 */
const CommunityCard = ({ user }: { user: CommunityUser }) => {
  const { openModal } = useModal();
  const { title: levelTitle, tier } = getLevelTier(user.level);

  const openBadgeModal = () => {
    openModal({
      type: "INFO",
      title: "🏅 획득한 뱃지",
      customContent: <BadgeListModal badges={user.badges} />,
      confirmText: "닫기",
    });
  };

  return (
    <Card $tier={tier}>
      <Top>
        <Emoji>{user.emoji}</Emoji>
        <Info>
          <Name>{user.nickname}</Name>
          <Level>Lv. {user.level}</Level>
        </Info>
        <LevelTitle>{levelTitle}</LevelTitle>
      </Top>

      <BadgeRow>
        {user.badges.slice(0, 3).map((badgeId) => {
          const achievement = ACHIEVEMENTS.find((a) => a.id === badgeId);

          if (!achievement) return null;
          return (
            <BadgeIcon key={badgeId} title={achievement.badge.title}>
              {achievement.badge.emoji}
            </BadgeIcon>
          );
        })}

        {user.badges.length > 3 && (
          <MoreBadgeButton onClick={() => openBadgeModal()}>
            +{user.badges.length - 3}
          </MoreBadgeButton>
        )}
      </BadgeRow>

      <Status>{user.status}</Status>
    </Card>
  );
};

export default CommunityCard;

/* ================= 스타일 ================= */

const goldShine = keyframes`
  0% {
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 1);
  }
  100% {
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
  }
`;

const Card = styled.div<{
  $isMe?: boolean;
  $isHighLevel?: boolean;
  $tier?: "COMMON" | "RARE" | "EPIC" | "LEGEND";
}>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 14px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  border: 2px solid transparent;

  /* ⭐ 내 카드 강조 */
  ${({ $isMe, theme }) =>
    $isMe &&
    `
      border: 2px solid ${theme.colors.primary};
      background: linear-gradient(
        180deg,
        ${theme.colors.primary},
        ${theme.colors.surface}
      );
    `}

  /* 👑 LEGEND 황금 카드 */
  ${({ $tier }) =>
    $tier === "LEGEND" &&
    css`
      background: linear-gradient(135deg, #fff8dc, #ffe066, #ffd700);

      border: 2px solid #ffb703;

      animation: ${goldShine} 2.5s infinite;
    `}
`;
const Top = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Emoji = styled.div`
  font-size: 30px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 800;
`;

const Level = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const Status = styled.div`
  font-size: 13px;
  line-height: 1.4;

  background: ${({ theme }) => theme.colors.background};
  padding: 10px 12px;
  border-radius: 14px;

  position: relative;

  /* 말풍선 꼬리 */
  &::before {
    content: "";
    position: absolute;
    top: -6px;
    left: 14px;

    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.colors.background};
    transform: rotate(45deg);
  }
`;
const LevelTitle = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  margin-left: auto;

  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const BadgeRow = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BadgeIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
`;

const MoreBadgeButton = styled.button`
  padding: 4px 8px;
  border-radius: 12px;
  border: none;

  background: ${({ theme }) => theme.colors.border};
  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
`;
