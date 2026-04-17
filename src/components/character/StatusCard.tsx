import styled from "styled-components";
import { useUser } from "../../context/UserContext";
import { useModal } from "../../context/UIContext/ModalContext";
import BadgeListModal from "../community/BadgeListModal";

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
  const { openModal } = useModal();

  const openBadgeModal = () => {
    openModal({
      type: "INFO",
      title: "🏅 획득한 뱃지",
      customContent: <BadgeListModal badges={achievements.map((a) => a.id)} />,
      confirmText: "닫기",
    });
  };
  return (
    <Wrapper>
      <Header>
        <span>🪙 보유 코인</span>
        <strong>{user.coin}</strong>
      </Header>

      <Divider />
      <BadgeHeader>
        <span>🏅 나의 뱃지</span>
        <small>{achievements.length}개</small>
      </BadgeHeader>
      <BadgeWrap>
        {achievements.length === 0 ? (
          <Empty>아직 업적이 없어요 🐣</Empty>
        ) : (
          achievements.slice(0, 5).map((a, idx) => (
            <Badge key={idx}>
              <span>{a.badge.emoji}</span>
              <small>{a.badge.title}</small>
            </Badge>
          ))
        )}
        {/* ✅ 3개 초과시 더보기 버튼 */}
        {achievements.length > 3 && (
          <MoreButton onClick={openBadgeModal}>
            +{achievements.length - 3} 더보기
          </MoreButton>
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
const BadgeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 8px;

  small {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;
const MoreButton = styled.button`
  padding: 6px 10px;
  border-radius: 999px;
  border: none;

  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};

  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;
