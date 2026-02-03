import styled from "styled-components";
import { BADGES, type BadgeId } from "../../data/badges";

/**
 * 🏅 뱃지 전체 목록 모달용 컴포넌트
 * - ModalContext의 customContent로 사용됨
 * - 전달받은 badgeId 배열을 기준으로 렌더링
 * - 뱃지 개수 많아질 수 있으므로 스크롤 적용
 */
type BadgeListModalProps = {
  badges: BadgeId[]; // 해당 유저가 획득한 뱃지 ID 목록
};

const BadgeListModal = ({ badges }: BadgeListModalProps) => {
  if (badges.length === 0) {
    return <EmptyText>아직 획득한 뱃지가 없어요 🥲</EmptyText>;
  }

  return (
    <ScrollContainer>
      <Grid>
        {badges.map((badgeId) => {
          const badge = BADGES[badgeId];

          return (
            <BadgeItem key={badgeId}>
              <Emoji>{badge.emoji}</Emoji>
              <Title>{badge.title}</Title>
              <Description>{badge.description}</Description>
            </BadgeItem>
          );
        })}
      </Grid>
    </ScrollContainer>
  );
};

export default BadgeListModal;
const ScrollContainer = styled.div`
  max-height: 240px; /* ⭐ 모달 안에서만 제한 */
  overflow-y: auto;
  padding-right: 4px; /* 스크롤바 여백 */

  /* 스크롤 부드럽게 */
  scroll-behavior: smooth;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const BadgeItem = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  text-align: center;
`;

const Emoji = styled.div`
  font-size: 28px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 800;
`;

const Description = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.3;
`;

const EmptyText = styled.div`
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;
