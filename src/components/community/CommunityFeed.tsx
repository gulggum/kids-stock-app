//친구 활동 피드 담당

import { type CommunityUser } from "../../data/mock/communityMock";
import CommunityCard from "./CommunityCard";
import styled from "styled-components";

interface CommunityFeedProps {
  users: CommunityUser[];
}

const CommunityFeed = ({ users }: CommunityFeedProps) => {
  return (
    <SectionBlock>
      <SectionTitle>친구들은 이렇게 하고 있어요</SectionTitle>
      <List>
        {users.map((user) => (
          <CommunityCard key={user.id} user={user} />
        ))}
      </List>
    </SectionBlock>
  );
};

export default CommunityFeed;

/* ================= 스타일 ================= */

const SectionBlock = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.muted};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
