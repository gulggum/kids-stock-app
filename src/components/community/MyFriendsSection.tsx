//나의 친구목록

import styled from "styled-components";
import CommunityCard from "./CommunityCard";
import { useState } from "react";
import type { PublicUser } from "../../types/UserType";

interface Props {
  users: PublicUser[];
  friends: string[];
  onToggleFriend: (id: string) => void;
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
        <Title>
          👥 내 친구{" "}
          <span style={{ fontSize: "10px", fontWeight: "500", color: "grey" }}>
            ( 즐겨찾기 기능이에요 )
          </span>
        </Title>
        <EmptyBox>
          <EmptyEmoji>🫂</EmptyEmoji>
          <EmptyText>아직 친구가 없어요</EmptyText>
          <EmptyHint>아래 추천 친구에서 팔로우해봐요!</EmptyHint>
        </EmptyBox>
      </Section>
    );
  }
  return (
    <Section>
      <Title>
        👥 내 친구{" "}
        <span style={{ fontSize: "10px", fontWeight: "500", color: "grey" }}>
          ( 즐겨찾기 기능이에요 )
        </span>
      </Title>
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
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 900;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
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
