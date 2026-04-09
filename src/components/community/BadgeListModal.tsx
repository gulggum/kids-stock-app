import styled from "styled-components";
import { ACHIEVEMENTS } from "../../data/rules/achievementRules";

/**
 * 🏅 뱃지 전체 목록 모달용 컴포넌트
 * - ModalContext의 customContent로 사용됨
 * - 전달받은 badgeId 배열을 기준으로 렌더링
 * - 뱃지 개수 많아질 수 있으므로 스크롤 적용
 */
type BadgeListModalProps = {
  badges: string[]; // 해당 유저가 획득한 뱃지 ID 목록
};

const BadgeListModal = ({ badges }: BadgeListModalProps) => {
  if (badges.length === 0) {
    return <EmptyText>아직 획득한 뱃지가 없어요 🥲</EmptyText>;
  }

  return (
    <ScrollContainer>
      {badges.map((badgeId) => {
        const achievement = ACHIEVEMENTS.find((a) => a.id === badgeId);
        if (!achievement) return null;

        return (
          <BadgeItem key={badgeId}>
            <EmojiBox>{achievement.badge.emoji}</EmojiBox>
            <TextBox>
              <Title>{achievement.badge.title}</Title>
              <Description>{achievement.badge.description}</Description>
            </TextBox>
          </BadgeItem>
        );
      })}
    </ScrollContainer>
  );
};

export default BadgeListModal;

const ScrollContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 4px 4px 0;
`;

const BadgeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 12px;
  position: relative;
  overflow: hidden;
`;

const EmojiBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
  flex-shrink: 0;
`;

const TextBox = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 800;
`;

const Description = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const EmptyText = styled.div`
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;
