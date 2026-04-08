/**
 * 📁 Market.tsx
 *
 * 기능
 * 1️⃣ 주식 목록 표시
 * 2️⃣ 검색 기능
 * 3️⃣ 국가 필터 (전체 / 한국 / 미국)
 * 4️⃣ 즐겨찾기(찜) 기능
 * 5️⃣ 환율 표시 + 달러 가격 계산
 */

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import StockCard from "../../components/stock/StockCard";
import ExchangeRateInfo from "../../components/stock/ExchangeRateInfo";

import { krwToUsd, usdToKrw } from "../../utils/currency";
import { getStorage, setStorage } from "../../utils/storage";
import { useStocksQuery } from "../../hooks/useStocksQuery";
import Loading from "../../components/Loading";
import { useExchangeRate } from "../../hooks/useExchangeRate";

type FilterType = "ALL" | "KR" | "US" | "FAVORITE";

const FAVORITE_KEY = "favorite_stocks";

const Market = () => {
  const navigate = useNavigate();

  /* ================= 상태 ================= */

  // 검색
  const [search, setSearch] = useState("");

  // 필터
  const [filter, setFilter] = useState<FilterType>("ALL");

  // 환율
  const exchangeRate = useExchangeRate();

  // 즐겨찾기 저장
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() =>
    getStorage(FAVORITE_KEY, []),
  );

  const { stocks: rawStocks, loading, error } = useStocksQuery();

  /* ================= 데이터 가공 ================= */

  // 찜 상태 반영
  const stocks = rawStocks.map((stock) => ({
    ...stock,
    isFavorite: favoriteIds.includes(stock.id),
  }));

  /* ================= 이벤트 ================= */

  // 즐겨찾기 토글
  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  // 상세 페이지 이동
  const handleCardClick = (id: number) => {
    navigate(`/market/${id}`);
  };

  /* ================= 검색 + 필터 ================= */

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

  /* ================= 리스트 분리 ================= */

  const favoriteStocks = filteredStocks.filter((s) => s.isFavorite);
  const favoriteKR = favoriteStocks.filter((s) => s.country === "KR");
  const favoriteUS = favoriteStocks.filter((s) => s.country === "US");
  const normalStocks = filteredStocks.filter((s) => !s.isFavorite);

  /* ================= 로컬스토리지 저장 ================= */

  useEffect(() => {
    setStorage(FAVORITE_KEY, favoriteIds);
  }, [favoriteIds]);

  /* ================= 카드 렌더 함수 ================= */

  const renderStockCard = (stock: any) => (
    <StockCard
      key={stock.id}
      name={stock.name}
      character={stock.character}
      price={stock.price}
      changeRate={stock.changeRate}
      country={stock.country}
      description={stock.description}
      isFavorite={stock.isFavorite}
      usdPrice={
        stock.country === "US" ? usdToKrw(stock.price, exchangeRate) : undefined
      }
      onToggleFavorite={() => toggleFavorite(stock.id)}
      onClick={() => handleCardClick(stock.id)}
    />
  );

  /* ================= UI ================= */
  // ✅ 로딩 상태
  if (loading) {
    return <Loading text="주식 정보를 불러오는 중이에요 📈" />;
  }
  // ✅ 에러 상태
  if (error) {
    return (
      <Wrapper>
        <LoadingText>잠시 후 다시 시도해주세요 🥲</LoadingText>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <StickyHeader>
        {/* 페이지 제목 */}
        <Title>주식 마켓</Title>

        {/* 환율 표시 */}
        <ExchangeRateInfo exchangeRate={exchangeRate} />

        {/* 검색 */}
        <SearchInput
          placeholder="회사 검색 (삼성, apple 등)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 필터 탭 */}
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

      {/* 검색 결과 없음 */}
      {search && filteredStocks.length === 0 && filter !== "FAVORITE" && (
        <EmptyText>찾는 회사가 없어요 🥲</EmptyText>
      )}

      {/* 찜 탭 비어있을 때 */}
      {filter === "FAVORITE" && favoriteStocks.length === 0 && (
        <EmptyText>
          관심있는 회사를 눌러 ⭐<br />
          나만의 기업 목록을 만들어보세요!
        </EmptyText>
      )}

      {/* 찜 탭 */}
      {filter === "FAVORITE" && (
        <>
          {favoriteKR.length > 0 && (
            <>
              <SectionTitle>⭐ 내가 좋아하는 기업</SectionTitle>
              <SubSectionTitle>🇰🇷 한국 기업</SubSectionTitle>
              {favoriteKR.map(renderStockCard)}
            </>
          )}

          {favoriteUS.length > 0 && (
            <>
              <SubSectionTitle>🇺🇸 미국 기업</SubSectionTitle>
              {favoriteUS.map(renderStockCard)}
            </>
          )}
        </>
      )}

      {/* 찜 상단 표시 */}
      {favoriteStocks.length > 0 && filter !== "FAVORITE" && (
        <>
          <SectionTitle>⭐ 내가 좋아하는 기업</SectionTitle>
          {favoriteStocks.map(renderStockCard)}

          <SectionTitle>전체 기업</SectionTitle>
        </>
      )}

      {/* 일반 리스트 */}
      {normalStocks.map(renderStockCard)}
    </Wrapper>
  );
};

export default Market;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

  display: flex;
  flex-direction: column;
  gap: 12px;

  padding-bottom: 10px;

  backdrop-filter: blur(8px);
`;

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
  padding: 10px 0px;
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

const SubSectionTitle = styled.div`
  margin-top: 10px;
  margin-bottom: 4px;

  font-size: 13px;
  font-weight: 700;

  color: ${({ theme }) => theme.colors.textSecondary};
`;
const LoadingText = styled.div`
  text-align: center;
  margin-top: 60px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
