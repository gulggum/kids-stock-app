//친구 활동 피드 담당

import { useState } from "react";
import CommunityCard from "./CommunityCard";
import styled from "styled-components";
import type { PublicUser } from "../../types/UserType";

interface CommunityFeedProps {
  users: PublicUser[];
  friends: string[];
  onToggleFriend: (id: string) => void;
}

const CommunityFeed = ({
  users,
  friends,
  onToggleFriend,
}: CommunityFeedProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const USERS_PER_PAGE = 3;

  //필터+페이지네이션 로직
  const filteredUsers = users.filter((user) =>
    user.nickname.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  // 보여줄 페이지 번호 계산 함수
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };
  return (
    <SectionBlock>
      <SectionTitle>친구들은 이렇게 하고 있어요</SectionTitle>

      <List>
        {currentUsers.length === 0 ? (
          <EmptyBox>
            <EmptyEmoji>📭</EmptyEmoji>
            <EmptyText>아직 활동한 친구가 없어요</EmptyText>
            <EmptyHint>친구를 팔로우하면 여기서 볼 수 있어요!</EmptyHint>
          </EmptyBox>
        ) : (
          <>
            {currentUsers.map((user) => (
              <CommunityCard
                key={user.id}
                user={user}
                isFriend={friends.includes(user.id)}
                onToggleFriend={onToggleFriend}
              />
            ))}
          </>
        )}
      </List>
      <SearchWrapper>
        <SearchInput
          placeholder="🔍 친구 이름 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </SearchWrapper>

      <Pagination>
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <Ellipsis key={`ellipsis-${i}`}>...</Ellipsis>
          ) : (
            <PageButton
              key={page}
              $active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PageButton>
          ),
        )}
      </Pagination>
    </SectionBlock>
  );
};

export default CommunityFeed;

/* ================= 스타일 ================= */

const SectionBlock = styled.section`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

//친구 검색창
const SearchWrapper = styled.div`
  margin-top: 10px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
`;

const PageButton = styled.button<{ $active: boolean }>`
  min-width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  cursor: pointer;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.card};

  color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.text)};

  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:active {
    transform: translateY(1px);
  }
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

const Ellipsis = styled.span`
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;
