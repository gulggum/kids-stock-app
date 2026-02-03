import styled from "styled-components";
import { type CommunityUser } from "../../data/communityMock";
import { getLevelTitle } from "../utils/getLevelTitle";

/**
 * 커뮤니티에 보여지는 유저 카드
 * - 말 없이도 "누가 활동 중인지" 보여주는 용도
 */
const CommunityCard = ({ user }: { user: CommunityUser }) => {
  const levelTitle = getLevelTitle(user.level);

  return (
    <Card>
      <Top>
        <Emoji>{user.emoji}</Emoji>
        <Info>
          <Name>{user.nickname}</Name>
          <Level>{user.levelTitle}</Level>
        </Info>
      </Top>
      <LevelTitle>{levelTitle}</LevelTitle>
      <BadgeRow>
        {user.badges.slice(0, 3).map((badgeId) => {
          const badge = BADGES[badgeId];
          return (
            <BadgeIcon key={badgeId} title={badge.title}>
              {badge.emoji}
            </BadgeIcon>
          );
        })}

        {user.badges.length > 3 && (
          <MoreBadgeButton onClick={() => openBadgeModal(user.badges)}>
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
const LevelTitle = styled.div`
  margin-top: 4px;
  padding: 4px 10px;

  border-radius: 999px; /* 뱃지 느낌 */
  background: ${({ theme }) => theme.colors.accentPurple};

  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};

  display: inline-flex;
  align-items: center;
  gap: 4px;

  white-space: nowrap;
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
