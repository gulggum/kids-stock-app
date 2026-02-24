import styled from "styled-components";
import { type CommunityUser } from "../../data/mock/communityMock";
import { LEVEL_RULES } from "../../data/rules/levelTitles";
import { useModal } from "../../context/UIContext/ModalContext";
import BadgeListModal from "./BadgeListModal";
import { ACHIEVEMENTS } from "../../data/rules/achievementRules";

/**
 * 커뮤니티에 보여지는 유저 카드
 * - 말 없이도 "누가 활동 중인지" 보여주는 용도
 */
const CommunityCard = ({ user }: { user: CommunityUser }) => {
  const { openModal } = useModal();

  const levelTitle =
    LEVEL_RULES.slice()
      .reverse()
      .find((rule) => user.level >= rule.level)?.title ?? "🐣 투자 새싹";
  const openBadgeModal = () => {
    openModal({
      type: "INFO",
      title: "🏅 획득한 뱃지",
      customContent: <BadgeListModal badges={user.badges} />,
      confirmText: "닫기",
    });
  };

  const achievedAchievements = user.badges
    .map((badgeId) => ACHIEVEMENTS.find((a) => a.id === badgeId))
    .filter(Boolean);

  // 등급 우선순위
  const tierPriority = {
    LEGEND: 3,
    RARE: 2,
    COMMON: 1,
  };

  const highestTier =
    achievedAchievements.length > 0
      ? achievedAchievements.sort(
          (a, b) => tierPriority[b!.tier] - tierPriority[a!.tier],
        )[0]!.tier
      : "COMMON";

  return (
    <Card>
      <Top>
        <Emoji>{user.emoji}</Emoji>
        <Info>
          <Name>{user.nickname}</Name>
          <Level>{user.levelTitle}</Level>
        </Info>
      </Top>
      <LevelTitle tier={highestTier}>{levelTitle}</LevelTitle>
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

const Card = styled.div<{ $isMe?: boolean; $isHighLevel?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 14px;

  display: flex;
  flex-direction: column;
  gap: 10px;

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

  /* 🏆 고레벨 유저 은근 과시 */
  ${({ $isHighLevel, theme }) =>
    $isHighLevel &&
    `
      box-shadow: 0 0 0 2px ${theme.colors.down};
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
const LevelTitle = styled.div<{ tier: "COMMON" | "RARE" | "LEGEND" }>`
  display: inline-block;
  align-items: center;
  gap: 6px;

  padding: 6px 12px;
  border-radius: 999px;

  background: ${({ tier, theme }) =>
    tier === "LEGEND"
      ? theme.colors.accentPurple + "30"
      : tier === "RARE"
        ? theme.colors.accentBlue + "25"
        : theme.colors.border};

  color: ${({ tier, theme }) =>
    tier === "LEGEND"
      ? theme.colors.accentPurple
      : tier === "RARE"
        ? theme.colors.accentBlue
        : theme.colors.textSecondary};

  box-shadow: ${({ tier }) =>
    tier === "LEGEND" ? "0 0 10px rgba(180,140,242,0.6)" : "none"};
  font-size: 12px;
  font-weight: 800;
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
