import styled, { css, keyframes } from "styled-components";
import { useModal } from "../../context/UIContext/ModalContext";
import BadgeListModal from "./BadgeListModal";
import { ACHIEVEMENTS } from "../../data/rules/achievementRules";
import { isUserOnline } from "../../utils/isUserOnline";
import { cardSkins } from "../../data/static/cardSkins";
import avatarSprite from "../../assets/avatars/avatarSprite.png";
import legendCard from "../../assets/cardSkins/legendSkinGold.png";
import { getLevelTier } from "../../utils/getLevelTier";
import { getTextColorFromSkin } from "../../utils/getTextColor";
import type { PublicUser } from "../../types/UserType";
import { HOUSES } from "../../data/static/house";

/**
 * 커뮤니티에 보여지는 유저 카드
 * - 말 없이도 "누가 활동 중인지" 보여주는 용도
 */
const CommunityCard = ({
  user,
  isFriend,
  onToggleFriend,
}: {
  user: PublicUser;
  isFriend?: boolean;
  onToggleFriend?: (id: string) => void;
}) => {
  const { openModal } = useModal();
  const { title, tier } = getLevelTier(user.level);

  const skin =
    cardSkins.find((s) => s.id === user.selectedSkin) ??
    cardSkins.find((s) => s.id === "basic") ??
    cardSkins[0];

  const currentSkin = skin;

  const textColor = getTextColorFromSkin(currentSkin);

  //착용 중인 집 뱃지 찾기
  const equippedHouse = HOUSES.find(
    (h) => h.id === (user.equippedHouseId ?? "house_basic"),
  );

  const openBadgeModal = () => {
    openModal({
      type: "INFO",
      title: "🏅 획득한 뱃지",
      customContent: <BadgeListModal badges={user.badges} />,
      confirmText: "닫기",
    });
  };
  //온라인 여부
  const online = isUserOnline(user.lastActive);
  return (
    <Card $tier={tier} $skin={skin}>
      <Top>
        <AvatarWrapper>
          <AvatarInner>
            {user.profileImage ? (
              <img src={user.profileImage} />
            ) : user.profileAvatar ? (
              <Sprite $x={user.profileAvatar.x} $y={user.profileAvatar.y} />
            ) : (
              <Emoji>{user.emoji}</Emoji>
            )}
            {online && <ActiveDot />}
          </AvatarInner>
        </AvatarWrapper>
        <Info>
          <NameRow>
            <Name>{user.nickname}</Name>

            {onToggleFriend && (
              <FollowButton
                $active={!!isFriend}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFriend(user.id);
                }}
              >
                {isFriend ? "친구" : "팔로우"}
              </FollowButton>
            )}
          </NameRow>
          <Level>Lv. {user.level}</Level>
        </Info>
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
        <LevelTitle $text={textColor}>{title}</LevelTitle>
      </BadgeRow>

      <Status>{user.status}</Status>
      {/* 🏠 집 뱃지 */}
      {equippedHouse && (
        <HouseBadge>
          <img src={equippedHouse.badge} alt={equippedHouse.name} />
        </HouseBadge>
      )}
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
  $skin?: any;
  $isMe?: boolean;
  $tier?: "COMMON" | "RARE" | "EPIC" | "LEGEND";
}>`
  background: ${({ $skin }) =>
    $skin?.gradient
      ? $skin.gradient
      : $skin?.image
        ? `url(${$skin.image}) center/cover`
        : "linear-gradient(135deg, #E8F5E9, #F1F8E9)"};

  position: relative;
  overflow: hidden;

  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  /* ⭐ 카드 입체감 */
  box-shadow: ${({ theme }) => theme.shadows.lg};

  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }

  /* ⭐ 내 카드 강조 */
  ${({ $isMe, theme }) =>
    $isMe &&
    `
      border: 2px solid ${theme.colors.primary};
      background: linear-gradient(
        180deg,
        ${theme.colors.primary}10,
        ${theme.colors.surface}
      );
    `}

  /* 👑 LEGEND 황금 카드 */
  ${({ $tier }) =>
    $tier === "LEGEND" &&
    css`
      background-image:
         linear-gradient(rgba(0, 0, 0, 0.11), rgba(0, 0, 0, 0.10)),
        url(${legendCard});,
      background-size: cover;
      background-position: top;
      animation: ${goldShine} 2.5s infinite;
    `}
`;
const Top = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Emoji = styled.div`
  font-size: 28px;

  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};

  position: relative;
`;

const ActiveDot = styled.div`
  position: absolute;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: #2ecc71;

  right: 3px;
  bottom: 2px;

  border: 2px solid white;
  z-index: 555;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.surface};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const FollowButton = styled.button<{ $active: boolean }>`
  padding: 4px 8px;
  border-radius: 999px;
  border: none;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.accentGreen : theme.colors.primary};

  color: white;

  box-shadow: ${({ theme }) => theme.shadows.sm};

  transition: all 0.15s ease;

  &:active {
    transform: scale(0.95);
  }
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

  border-radius: 12px;

  position: relative;

  /* 말풍선 꼬리 */
  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 16px;

    width: 10px;
    height: 10px;

    background: ${({ theme }) => theme.colors.background};

    transform: rotate(45deg);
  }
`;
const LevelTitle = styled.div<{ $text: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  margin-left: auto;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);

  /* ⭐ 테두리로 뱃지 느낌 */
  border: 1px solid rgba(255, 255, 255, 0.4);

  /* ⭐ 텍스트 색은 자동 */
  color: ${({ $text }) => $text};

  /* ⭐ 살짝 떠있는 느낌 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  /* ⭐ 살짝 반짝 느낌 */
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    opacity: 0.6;
    pointer-events: none;
  }
`;
const BadgeRow = styled.div`
  margin-top: 4px;

  display: flex;
  align-items: center;
  gap: 6px;
`;

const BadgeIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  background: ${({ theme }) => theme.colors.background};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;

  /* border: 1px solid ${({ theme }) => theme.colors.border}; */
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
const AvatarWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AvatarInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Sprite = styled.div<{ $x: number; $y: number }>`
  width: 100%;
  height: 100%;

  background-image: url(${avatarSprite});
  background-size: 500% 300%;
  background-position: ${({ $x, $y }) =>
    `${($x / 3.8999) * 100}% ${($y / 2) * 100}%`};
`;

// 스타일 추가
const HouseBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 20px;
  width: 80px;
  height: 80px;
  z-index: 5;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;
