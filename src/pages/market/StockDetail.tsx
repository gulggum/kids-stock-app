import { useParams } from "react-router";
import { useNavigate } from "react-router";
import styled, { useTheme } from "styled-components";
import ChartPeriodToggle from "../../components/stock/ChartPeriodToggle";
import StockChart from "../../components/stock/StockChart";
import StockDetailHeader from "../../components/stock/StockDetailHeader";
import StockPriceSection from "../../components/stock/StockPriceSection";
import { useStockDetail } from "../../hooks/useStockDetail";
import BuySellSection from "../../components/stock/BuySellSection";
import { useStockByIdQuery } from "../../hooks/useStocksQuery";
import { useChart } from "../../hooks/useChart";
import { useUser } from "../../context/UserContext";
import StockReasonChart from "../../components/stock/StockReasonChart";
import { useMemo, useState } from "react";
import { BUFFETT_INFO, BUFFETT_QUOTES } from "../../data/static/buffettQuotes";
import InfoModal from "../../components/InfoModal";
import Loading from "../../components/Loading";

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useUser();

  // state 추가
  const [showBuffett, setShowBuffett] = useState(false);

  // 버핏 명언 랜덤 노출
  const quote = useMemo(
    () => BUFFETT_QUOTES[Math.floor(Math.random() * BUFFETT_QUOTES.length)],
    [],
  );

  // ✅ 변경: marketMockData.find → useStockByIdQuery
  const { stock: company, loading } = useStockByIdQuery(id ? Number(id) : null);

  const {
    period,
    setPeriod,
    activeTab,
    setActiveTab,
    animateMoney,
    showMoneyEffect,
    showSellEffect,
    showGuideModal,
    setShowGuideModal,
    checks,
    toggleCheck,
    isAllChecked,
    money,
    isHoldingStock,
    handleBuyClick,
    handleBuyConfirm,
    handleSellClick,
  } = useStockDetail(company ?? { id: 0, name: "", price: 0 });

  const { data: chartData = [], isLoading: chartLoading } = useChart(
    company?.symbol ?? "",
    period === "7d" ? "7d" : "30d",
  );

  // 로딩
  if (loading) {
    return <Loading text="불러오는 중이에요 📈" />;
  }

  // 못 찾음
  if (!company) {
    return <Loading text="회사를 찾을 수 없어요 🥲" />;
  }

  const isHolding = isHoldingStock(company.id);

  return (
    <Wrapper>
      {/* 🔝 헤더 */}
      <StockDetailHeader
        money={money}
        animateMoney={animateMoney}
        onBack={() => navigate(-1)}
        country={company.country}
      />

      <Content>
        {/* 🏢 회사 정보 */}
        <Title>
          {company.character} {company.name}
        </Title>
        <Description>{company.description}</Description>

        <InfoBox>
          <strong>분야</strong>
          <div>{company.category}</div>
        </InfoBox>

        {/* 💰 가격 */}
        <StockPriceSection
          price={company.price}
          changeRate={company.changeRate}
          country={company.country}
        />

        {/* 📊 탭 */}
        <TabHeader>
          <TabButton
            $active={activeTab === "CHART"}
            onClick={() => setActiveTab("CHART")}
          >
            📊 차트
          </TabButton>
          <TabButton
            $active={activeTab === "MY_STOCK"}
            onClick={() => setActiveTab("MY_STOCK")}
          >
            🧾 내 주식
          </TabButton>
        </TabHeader>

        {/* 📦 탭 내용 */}
        <ContentSection>
          {/* 📊 차트 */}
          <ChartContent $active={activeTab === "CHART"}>
            <ChartSection>
              <ChartHeader>
                <ChartTitle>가격 변화</ChartTitle>
                <ChartPeriodToggle value={period} onChange={setPeriod} />
              </ChartHeader>

              <ChartPlaceholder>
                {chartLoading ? (
                  <div>차트 불러오는 중...</div>
                ) : (
                  <StockChart
                    data={chartData}
                    strokeColor={theme.colors.muted}
                    country={company.country}
                    period={period}
                  />
                )}
              </ChartPlaceholder>
            </ChartSection>
          </ChartContent>

          {/* 🧾 내 주식 */}
          <MyStockContent $active={activeTab === "MY_STOCK"}>
            {isHolding ? (
              <MyStockCard>
                ⭐ 이 회사 주식을 가지고 있어요!
                <SubText>지금은 가격의 변화를 지켜보는 단계예요 😊</SubText>
              </MyStockCard>
            ) : (
              <MyStockCard>
                아직 이 회사 주식은 없어요 🙂
                <SubText>관심이 생기면 한 번 사볼 수 있어요!</SubText>
              </MyStockCard>
            )}
          </MyStockContent>
        </ContentSection>

        <QuoteBox>
          <QuoteTitle>💬 오늘의 명언!</QuoteTitle>
          <KidsQuote>{quote.kids}</KidsQuote>
          <OriginalQuote>
            "{quote.original}" <br />—
            <AuthorButton onClick={() => setShowBuffett(true)}>
              {" "}
              {quote.author}
            </AuthorButton>
          </OriginalQuote>
        </QuoteBox>
        {/* 명언 버핏 팝업창 */}
        <InfoModal
          open={showBuffett}
          onClose={() => setShowBuffett(false)}
          title={`${BUFFETT_INFO.emoji} ${BUFFETT_INFO.name}`}
          buttonText="닫기"
        >
          <PopupTitle>{BUFFETT_INFO.title}</PopupTitle>
          <PopupImage src={BUFFETT_INFO.image} alt={BUFFETT_INFO.name} />
          <PopupDesc>
            {" "}
            {BUFFETT_INFO.desc.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </PopupDesc>
        </InfoModal>
        {/* 구매이유 통계 */}
        <StockReasonChart stockId={company.id} />
        {/* 🛒 구매/판매 */}
        <BuySellSection
          showGuideModal={showGuideModal}
          setShowGuideModal={setShowGuideModal}
          checks={checks}
          toggleCheck={toggleCheck}
          isAllChecked={isAllChecked}
          handleBuyClick={handleBuyClick}
          handleBuyConfirm={handleBuyConfirm}
          handleSellClick={handleSellClick}
          showMoneyEffect={showMoneyEffect}
          showSellEffect={showSellEffect}
          company={company}
          myMoney={money}
          myDollars={user.dollars}
        />
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 24px;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.4;
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

/* =========================
   탭 버튼 영역
   ========================= */
const TabHeader = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 15px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};

  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
`;

//탭 ui 공통 애니메이션 베이스
const TabContentBase = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 16px;

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: ${({ $active }) =>
    $active ? "translateX(0)" : "translateX(12px)"};

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;

  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
`;

/* =========================
   탭 내용 고정 컨테이너
   ========================= */
const ContentSection = styled.div`
  position: relative;
  padding: 10px;
  height: 340px; /* 공간 고정 */

  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
`;
const MyStockContent = styled(TabContentBase)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

/* =========================
   📊 차트 영역
   ========================= */
const ChartContent = styled(TabContentBase)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};

  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ChartTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const ChartPlaceholder = styled.div`
  height: 240px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;
/* =========================
    내 주식 영역
   ========================= */
const MyStockCard = styled.div`
  margin-top: 12px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;
  font-size: 15px;
  font-weight: 700;
`;

const SubText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

// Quote(명언)
const QuoteBox = styled.div`
  background: ${({ theme }) => theme.colors.card};

  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;

  /* 네온 테두리 */
  border: 1px solid ${({ theme }) => theme.colors.primary}60;
  box-shadow:
    0 0 8px ${({ theme }) => theme.colors.primary}40,
    0 0 20px ${({ theme }) => theme.colors.primary}20;
`;

const QuoteTitle = styled.p`
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;
const KidsQuote = styled.p`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const OriginalQuote = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  line-height: 1.5;
`;
const AuthorButton = styled.span`
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  margin-top: auto;
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

//버핏정보 팝업

const PopupImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 4px;
  display: block;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 3px solid ${({ theme }) => theme.colors.primary}30;
`;

const PopupTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-block;
  margin: 0 auto;
`;

const PopupDesc = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
  text-align: left;
  word-break: keep-all; /* 단어 중간에 줄바꿈 방지 */
  padding: 0 4px;
`;

export default StockDetail;
