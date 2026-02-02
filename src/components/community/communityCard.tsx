import styled from "styled-components";
import { type CommunityUser } from "../../data/communityMock";

/**
 * 커뮤니티에 보여지는 유저 카드
 * - 말 없이도 "누가 활동 중인지" 보여주는 용도
 */
const CommunityCard = ({ user }: { user: CommunityUser }) => {
  return (
    <Card>
      <Top>
        <Emoji>{user.emoji}</Emoji>
        <Info>
          <Name>{user.nickname}</Name>
          <Level>{user.levelTitle}</Level>
        </Info>
      </Top>

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
