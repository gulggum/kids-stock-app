//추천친구
import styled from "styled-components";
import { type CommunityUser } from "../../data/mock/PublicUserMock";

interface Props {
  users: CommunityUser[];
  friends: number[];
  onToggleFriend: (id: number) => void;
}

const SuggestionSection = ({ users, friends, onToggleFriend }: Props) => {
  const suggested = users.filter((u) => !friends.includes(u.id)).slice(0, 4); // 최대 4명만

  return (
    <Section>
      <Title>✨ 추천 친구</Title>
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
    </Section>
  );
};

export default SuggestionSection;

/* 스타일 */
const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 900;
  margin-bottom: 10px;
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
  background: ${({ theme }) => theme.colors.card};

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Name = styled.div`
  font-size: 12px;
  font-weight: 700;
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
