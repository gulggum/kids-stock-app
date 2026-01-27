import { useParams } from "react-router";
import { useNavigate } from "react-router";
import styled, { useTheme } from "styled-components";
import { companyMeta } from "../../data/companyMeta";
import ChartPeriodToggle from "../../components/stock/ChartPeriodToggle";
import { useState } from "react";
import { companyExplain } from "../../data/companyExplain";
import { chartMock } from "../../data/chartMock";
import StockChart from "../../components/stock/StockChart";
import { useCoin } from "../../context/Coin&Money/CoinContext";
import { useCharacter } from "../../context/CharacterContext";
import { useBadge } from "../../context/BadgeContext";
import { useTrade } from "../../context/TradeContext";
import { useModal } from "../../context/ModalContext";
import { useMoney } from "../../context/Coin&Money/MoneyContext";

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme(); //테마 가져오기
  const { addCoin } = useCoin();
  const { addExp } = useCharacter(); //경험치 획득
  const { earnBadge, hasBadge } = useBadge();
  const { buyStock, hasBoughtToday, isHoldingStock } = useTrade();
  const { openModal } = useModal();
  const { money, spendMoney } = useMoney();
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [activeTab, setActiveTab] = useState<"CHART" | "MY_STOCK">("CHART");
  const explain = companyExplain[Number(id)];

  if (!id || !companyMeta[id]) {
    return <div>회사를 찾을 수 없어요 🥲</div>;
  }
  const company = companyMeta[id];

  //차트 데이터의 "시작값"과 "마지막 값"을 비교해, 전체 흐름이 상승인지/하락인지 판단
  const isChartUptrend = (data: { price: number }[]) => {
    if (data.length < 2) return true; //데이터1개이하면 비교기준x -> false(상승아님)
    const first = data[0].price; //가장 과거 가격(차트시작 지점)
    const last = data[data.length - 1].price; //가장 최근 가격(차트 마지막 지점)

    return last > first;
  };

  //차트 흐름에 따라 아이 눈높이 설명 문구 생성
  const getExplainTextByTrend = (
    isUp: boolean,
    companyName: string,
    isHolding: boolean,
  ) => {
    if (isUp) {
      return isHolding //("올랐고 + 내가 보유"):("올랐고 + 내가 미보유")
        ? `${companyName}를 좋아하는 사람이 늘어나서, 내가 산 주식의 가치가 조금 올라간 것 같아요! 😊`
        : `${companyName}를 찾는 사람이 많아져서, 회사의 가치가 올라간 것 같아요.`;
    }
    return isHolding //("내려갔고 + 내가 보유"):("내려갔고 + 내가 미보유")
      ? `${companyName}에 대한 관심이 잠시 줄어서, 내가 가진 주식의 가격이 내려갔을 수도 있어요.`
      : `${companyName}를 찾는 사람이 줄어서, 가격이 내려갔을 수도 있어요.`;
  };
  const isHolding = isHoldingStock(company.id);
  //선택된 기간의 차트 데이터
  const chartData = chartMock[company.id][period];
  //상승,하락 판단
  const isUptrend = isChartUptrend(chartData);
  //설명 문구 생성
  const explainText = getExplainTextByTrend(isUptrend, company.name, isHolding);

  const handleBuyConfirm = () => {
    spendMoney(company.price); //머니 차감, 현재는 돈 부족해도 구매 막지않고, 돈쓰면 줄어든다는 경험만 제공

    buyStock(company); //주식 구매 처리 (보유 상태 기록)

    //오늘의 보상
    addCoin(1);
    addExp(10);
    //첫 투자 뱃지
    if (!hasBadge("FIRST_BUY")) {
      earnBadge("FIRST_BUY");
    }
    //오늘의 한번 뱃지
    if (!hasBadge("DAILY_ONCE")) {
      earnBadge("DAILY_ONCE");
    }
  };

  const handleBuyClick = () => {
    /*  // ❗(머니 부족 로직) - 추후 on  
if (money < company.price) {
  openModal({
    type: "INFO",
    title: "돈이 조금 부족해요",
    message: "퀘스트를 하면 돈을 더 모을 수 있어요!",
    confirmText: "알겠어요",
  });
  return;
    }
*/
    openModal({
      type: "CONFIRM",
      title: "구매할까요?",
      message: `${company.name}\n${company.price}원`,
      confirmText: "구매",
      cancelText: "아니오",
      onConfirm: handleBuyConfirm,
    });
  };

  //

  return (
    <Wrapper>
      <StickyHeader>
        {/* 🔙 뒤로가기 */}
        <BackButton onClick={() => navigate(-1)}>← 돌아가기</BackButton>
        <MoneyBar>
          <MoneyLabel>💰 내가 가진 돈</MoneyLabel>
          <MoneyAmount>{money.toLocaleString()}</MoneyAmount>
        </MoneyBar>
      </StickyHeader>
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
        {/* 💰 가격 정보 영역 */}
        <PriceSection>
          <PriceInfo>
            <PriceLabel>현재 가격</PriceLabel>
            <PriceValue>{company.price.toLocaleString()}원</PriceValue>
          </PriceInfo>

          <ChangeRate $positive={company.changeRate >= 0}>
            {company.changeRate >= 0 ? "▲" : "▼"} {Math.abs(company.changeRate)}
            %
          </ChangeRate>
        </PriceSection>
        {/* 탭 버튼 영역 */}
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
        <ContentSection>
          {" "}
          {/* 📊 차트 영역 */}
          <ChartContent $active={activeTab === "CHART"}>
            <ChartSection>
              <ChartHeader>
                <ChartTitle>가격 변화</ChartTitle>
                <ChartPeriodToggle value={period} onChange={setPeriod} />
              </ChartHeader>

              {/* 차트 컴포넌트 자리 */}
              <ChartPlaceholder>
                <StockChart
                  data={chartData}
                  strokeColor={isUptrend ? theme.colors.up : theme.colors.down}
                />
              </ChartPlaceholder>
            </ChartSection>
          </ChartContent>
          {/* 🧾 내 주식 탭 */}
          <MyStockContent $active={activeTab === "MY_STOCK"}>
            {isHoldingStock(company.id) ? (
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

        {/* 💡 설명 카드 */}
        <ExplainCard>
          <ExplainTitle>{explain?.title}</ExplainTitle>
          <ExplainText>{explainText}</ExplainText>
        </ExplainCard>
        {/* 🛒 구매 버튼 */}
        {hasBoughtToday && (
          <HintText>
            하루에 한 번만 구매 할 수 있어요 🙂
            <br />
            내일 다시 도전해보세요!
          </HintText>
        )}
        <BuyButton disabled={hasBoughtToday} onClick={handleBuyClick}>
          {hasBoughtToday ? "오늘은 이미 구매완료 🌙" : "이 주식 구매하기 🛒"}
        </BuyButton>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

//헤더 고정영역
const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

  background: ${({ theme }) => theme.colors.background};
  padding: 12px 16px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  /* 아래 콘텐츠와 구분감 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BackButton = styled.button`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: ${({ theme }) => theme.shadows.sm};

  transition:
    background 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.card};
    transform: translateX(-2px); /* ← 느낌 */
  }

  &:active {
    transform: translateX(0) scale(0.97);
    box-shadow: none;
  }
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
const PriceSection = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PriceLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PriceValue = styled.span`
  font-size: 22px;
  font-weight: 700;
`;

const ChangeRate = styled.div<{ $positive: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.up : theme.colors.down};
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
  padding: 10px;
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
  background: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};

  height: 300px; /* 공간 고정 */
  position: relative;
  overflow: hidden; /* 애니메이션 영역 밖 숨김 */
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
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const ChartPlaceholder = styled.div`
  height: 200px;
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

/* =========================
   💡 설명 카드
   ========================= */

const ExplainCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ExplainTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const ExplainText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const BuyButton = styled.button<{ disabled?: boolean }>`
  margin-top: 12px;
  padding: 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.muted : theme.colors.primary};
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.98)")};
  }
`;

const HintText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`;

const MoneyBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.lg};

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surface},
    ${({ theme }) => theme.colors.card}
  );

  box-shadow: ${({ theme }) => theme.shadows.sm};

  font-size: 14px;
  font-weight: 700;
`;
const MoneyLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const MoneyAmount = styled.strong`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

export default StockDetail;
