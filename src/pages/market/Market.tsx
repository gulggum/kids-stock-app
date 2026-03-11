import styled from "styled-components";
import StockCard from "../../components/stock/StockCard";
import { useNavigate } from "react-router";
import { marketMockData, type Stock } from "../../data/mock/marketMock";
import { useState } from "react";

type FilterType = "ALL" | "KR" | "US" | "FAVORITE";

const Market = () => {
  const navigate = useNavigate();
  // 주식 상태 (즐겨찾기 포함)
  const [stocks, setStocks] = useState<Stock[]>(marketMockData);
  // 검색 상태
  const [search, setSearch] = useState("");
  // 필터 상태
  const [filter, setFilter] = useState<FilterType>("ALL");

  /* ⭐ 즐겨찾기 토글 */
  const toggleFavorite = (id: number) => {
    setStocks((prev) =>
      prev.map((stock) =>
        stock.id === id ? { ...stock, isFavorite: !stock.isFavorite } : stock,
      ),
    );
  };

  const handleCardClick = (id: number) => {
    navigate(`/market/${id}`);
  };

  // 🔎 검색 + 필터 적용
  const filteredStocks = stocks.filter((stock) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      stock.name.toLowerCase().includes(keyword) ||
      stock.description.toLowerCase().includes(keyword);

    const matchFilter =
      filter === "ALL" ||
      (filter === "KR" && stock.country === "KR") ||
      (filter === "US" && stock.country === "US") ||
      (filter === "FAVORITE" && stock.isFavorite);

    return matchSearch && matchFilter;
  });

  // /즐겨찾기 / 일반 리스트 분리
  const favoriteStocks = filteredStocks.filter((s) => s.isFavorite);
  const normalStocks = filteredStocks.filter((s) => !s.isFavorite);

  return (
    <Wrapper>
      <StickyHeader>
        {/* 📢 페이지 타이틀 */}
        <Title>주식 마켓</Title>

        {/* 🔎 검색 */}
        <SearchInput
          placeholder="회사 검색 (삼성, apple 등)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ⭐ 필터 탭 */}
        <FilterBar>
          <FilterButton
            $active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          >
            🌍 전체
          </FilterButton>

          <FilterButton
            $active={filter === "KR"}
            onClick={() => setFilter("KR")}
          >
            🇰🇷 한국
          </FilterButton>

          <FilterButton
            $active={filter === "US"}
            onClick={() => setFilter("US")}
          >
            🇺🇸 미국
          </FilterButton>

          <FilterButton
            $active={filter === "FAVORITE"}
            onClick={() => setFilter("FAVORITE")}
          >
            ⭐ 찜
          </FilterButton>
        </FilterBar>
      </StickyHeader>
      {/* 🧩 주식 카드 리스트 */}
      {filteredStocks.length === 0 && (
        <EmptyText>찾는 회사가 없어요 🥲</EmptyText>
      )}
      {/* 찜목록탭에 추가 */}
      {filter === "FAVORITE" && (
        <>
          <SectionTitle>⭐ 내가 좋아하는 기업</SectionTitle>

          {favoriteStocks.map((stock) => (
            <StockCard
              key={stock.id}
              name={stock.name}
              character={stock.character}
              price={stock.price}
              changeRate={stock.changeRate}
              country={stock.country}
              description={stock.description}
              isFavorite={stock.isFavorite}
              onToggleFavorite={() => toggleFavorite(stock.id)}
              onClick={() => handleCardClick(stock.id)}
            />
          ))}
        </>
      )}
      {/* 찜목록 상위리스트로 이동 */}
      {favoriteStocks.length > 0 && filter !== "FAVORITE" && (
        <>
          <SectionTitle>⭐ 내가 좋아하는 기업</SectionTitle>

          {favoriteStocks.map((stock) => (
            <StockCard
              key={stock.id}
              name={stock.name}
              character={stock.character}
              price={stock.price}
              changeRate={stock.changeRate}
              country={stock.country}
              description={stock.description}
              isFavorite={stock.isFavorite}
              onToggleFavorite={() => toggleFavorite(stock.id)}
              onClick={() => handleCardClick(stock.id)}
            />
          ))}

          <SectionTitle>전체 기업</SectionTitle>
        </>
      )}
      {normalStocks.map((stock) => (
        <StockCard
          key={stock.id}
          name={stock.name}
          character={stock.character}
          price={stock.price}
          changeRate={stock.changeRate}
          country={stock.country}
          description={stock.description}
          isFavorite={stock.isFavorite}
          onToggleFavorite={() => toggleFavorite(stock.id)}
          onClick={() => handleCardClick(stock.id)}
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 
  pc버전용..?
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px; */
`;
const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

  display: flex;
  flex-direction: column;
  gap: 12px;

  padding-bottom: 10px;

  background: ${({ theme }) => theme.colors.background};
  backdrop-filter: blur(8px);
  background: ${({ theme }) => theme.colors.background};
`;

// 페이지 제목
const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 22px;
`;
const SearchInput = styled.input`
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};

  background: rgba(255, 255, 255, 0.7);
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;

  outline: none;

  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterBar = styled.div`
  display: flex;

  gap: 8px;
  padding-bottom: 9px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 14px;

  border-radius: 999px;

  border: none;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surface};

  color: ${({ theme, $active }) => ($active ? "#fff" : theme.colors.text)};

  box-shadow: ${({ theme, $active }) => ($active ? theme.shadows.sm : "none")};

  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyText = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;

  margin-top: 10px;
  margin-bottom: 4px;

  color: ${({ theme }) => theme.colors.textSecondary};
`;
export default Market;
