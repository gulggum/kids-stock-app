//추천친구
import styled from "styled-components";
import type { PublicUser } from "../../types/UserType";

interface Props {
  users: PublicUser[];
  friends: string[];
  onToggleFriend: (id: string) => void;
}

const SuggestionSection = ({ users, friends, onToggleFriend }: Props) => {
  const suggested = users.filter((u) => !friends.includes(u.id)).slice(0, 4); // 최대 4명만

  return (
    <Section>
      <Title>✨ 추천 친구</Title>
      {suggested.length === 0 ? (
        <EmptyBox>
          <EmptyEmoji>🔍</EmptyEmoji>
          <EmptyText>추천할 친구가 없어요</EmptyText>
          <EmptyHint>친구들이 가입하면 여기 나타나요!</EmptyHint>
        </EmptyBox>
      ) : (
        <Row>
          {suggested.map((user) => (
            <MiniCard key={user.id}>
              <span>{user.emoji}</span>
              <Name>{user.nickname}</Name>

              <AddButton onClick={() => onToggleFriend(user.id)}>
                + 팔로우
              </AddButton>
            </MiniCard>
          ))}
        </Row>
      )}
    </Section>
  );
};

export default SuggestionSection;

/* 스타일 */
const Section = styled.section`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 900;
  margin-bottom: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const MiniCard = styled.div`
  min-width: 80px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Name = styled.div`
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddButton = styled.button`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
`;
const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px 16px;
`;

const EmptyEmoji = styled.div`
  font-size: 32px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const EmptyHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  text-align: center;
`;
