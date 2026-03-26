import styled from "styled-components";
import { useUser } from "../../context/UserContext";

/**
 * 🪙 상태 카드
 * - 코인
 * - 업적
 */
type Props = {
  achievements: any[];
};

const StatusCard = ({ achievements }: Props) => {
  const { user } = useUser();
  return (
    <Wrapper>
      <Header>
        <span>🪙 보유 코인</span>
        <strong>{user.coin}</strong>
      </Header>

      <Divider />

      <BadgeWrap>
        {achievements.length === 0 ? (
          <Empty>아직 업적이 없어요 🐣</Empty>
        ) : (
          achievements.map((a, idx) => (
            <Badge key={idx}>
              <span>{a.badge.emoji}</span>
              <small>{a.badge.title}</small>
            </Badge>
          ))
        )}
      </BadgeWrap>
    </Wrapper>
  );
};

export default StatusCard;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;

  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
`;

const Divider = styled.div`
  height: 1px;
  margin: 10px 0;
  background: ${({ theme }) => theme.colors.border};
`;

const BadgeWrap = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Badge = styled.div`
  padding: 6px 10px;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.accentGreen};
  color: white;

  font-size: 12px;
  font-weight: 700;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const Empty = styled.div`
  font-size: 12px;
`;
