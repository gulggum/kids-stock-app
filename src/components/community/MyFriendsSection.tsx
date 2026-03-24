//나의 친구목록

import styled from "styled-components";
import { type CommunityUser } from "../../data/mock/communityMock";
import CommunityCard from "./CommunityCard";
import { useState } from "react";

interface Props {
  users: CommunityUser[];
  friends: number[];
  onToggleFriend: (id: number) => void;
}

const MyFriendsSection = ({ users, friends, onToggleFriend }: Props) => {
  const myFriends = users.filter((u) => friends.includes(u.id));
  //더보기 접기 기능
  const [showAll, setShowAll] = useState(false);
  //보여줄 친구 분기
  const displayedFriends = showAll ? myFriends : myFriends.slice(0, 3);

  if (myFriends.length === 0) {
    return (
      <Section>
        <Title>👥 내 친구</Title>
        <Empty>
          아직 친구가 없어요 😢
          <br />+ 팔로우를 클릭해 내 친구를 등록하세요!
        </Empty>
      </Section>
    );
  }

  return (
    <Section>
      <Title>👥 내 친구</Title>
      <List>
        {displayedFriends.map((user) => (
          <CommunityCard
            key={user.id}
            user={user}
            isFriend={true}
            onToggleFriend={onToggleFriend}
          />
        ))}
        {myFriends.length > 3 && (
          <ToggleButton onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? "접기 ▲" : `더보기 ${myFriends.length - 3}명 ▼`}
          </ToggleButton>
        )}
      </List>
    </Section>
  );
};

export default MyFriendsSection;

/* 스타일 */
const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 900;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Empty = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const ToggleButton = styled.button`
  margin-top: 6px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
  cursor: pointer;
  font-size: 13px;

  &:active {
    transform: scale(0.96);
  }
`;
