import styled from "styled-components";
import { usePortfolio } from "../context/PortfolioContext";
import PortfolioSummaryCard from "../components/portfolio/PortfolioSummaryCard";
import { useNavigate } from "react-router";
import { usePortfolioStocks } from "../hooks/Useportfoliostocks";
import { useState } from "react";
import InfoModal from "../components/InfoModal";
import InfoIcon from "../components/InfoIcon";
import { useExchangeRate } from "../hooks/useExchangeRate";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const { getCurrentPrice } = usePortfolioStocks(portfolio);
  const exchangeRate = useExchangeRate();

  const toggleInfo = (key: string) => {
    setOpenInfo((prev) => (prev === key ? null : key));
  };

  // 가격 표시 헬퍼
  // 미국 주식: "$305.46 (451,230원)" 형식
  // 한국 주식: "209,500원" 형식
  const formatPrice = (price: number, country?: "KR" | "US") => {
    if (country === "US") {
      const krw = Math.round(price * exchangeRate);
      return {
        main: `$${price.toLocaleString()}`,
        sub: `(${krw.toLocaleString()}원)`,
      };
    }
    return { main: `${Math.round(price).toLocaleString()}원`, sub: null };
  };

  return (
    <Wrapper>
      <TopSection>
        <PageTitle>내 포트폴리오 💼</PageTitle>
        <PortfolioSummaryCard />
      </TopSection>

      <ListSection>
        {portfolio.length === 0 ? (
          <Empty role="status">
            아직 구매한 주식이 없어요 🥲
            <SmallHint>마켓에서 첫 투자를 시작해보세요!</SmallHint>
            <GoMarketButton onClick={() => navigate("/market")}>
              📈 마켓 바로가기
            </GoMarketButton>
            <TipBox>
              <TipTitle>💡 투자 꿀팁!</TipTitle>
              <TipText>
                주식은 <strong>쌀 때 사서 비쌀 때 파는</strong> 게 핵심이에요!
                <br />
                📉 가격이 내려갈 때 사고 → 📈 올라가면 팔아봐요
              </TipText>
            </TipBox>
          </Empty>
        ) : (
          portfolio.map((item) => {
            const isUS = item.country === "US";
            const currentPrice = getCurrentPrice(item);
            const profitRate =
              ((currentPrice - item.buyPrice) / item.buyPrice) * 100;
            const profitAmount = (currentPrice - item.buyPrice) * item.quantity;
            const totalValue = currentPrice * item.quantity;
            const isUp = profitRate >= 0;

            const buyPriceFmt = formatPrice(item.buyPrice, item.country);
            const currentPriceFmt = formatPrice(currentPrice, item.country);
            const totalValueFmt = formatPrice(totalValue, item.country);

            return (
              <ItemCard
                key={item.id}
                onClick={() => navigate(`/market/${item.id}`)}
                role="button"
                aria-label={`${item.name} 상세 보기`}
              >
                <TitleRow>
                  <Title>{item.name}</Title>
                  <CountryBadge $isUS={isUS}>
                    {isUS ? "🇺🇸 미국" : "🇰🇷 한국"}
                  </CountryBadge>
                </TitleRow>

                <Info>
                  <Label>내가 가진 주식</Label>
                  <Value>{item.quantity}주</Value>
                </Info>

                <Info>
                  <Label>
                    내가 산 가격
                    <InfoIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInfo("buyPrice");
                      }}
                    />
                  </Label>
                  <PriceGroup>
                    <Value>{buyPriceFmt.main}</Value>
                    {buyPriceFmt.sub && <SubValue>{buyPriceFmt.sub}</SubValue>}
                  </PriceGroup>
                </Info>

                <Divider />

                <Info>
                  <Label>
                    현재 가격
                    <InfoIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInfo("currentPrice");
                      }}
                    />
                  </Label>
                  <PriceGroup>
                    <Value>{currentPriceFmt.main}</Value>
                    {currentPriceFmt.sub && (
                      <SubValue>{currentPriceFmt.sub}</SubValue>
                    )}
                  </PriceGroup>
                </Info>

                <Info>
                  <Label>
                    현재 가치 💰
                    <InfoIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInfo("totalValue");
                      }}
                    />
                  </Label>
                  <PriceGroup>
                    <ValueHighlight>{totalValueFmt.main}</ValueHighlight>
                    {totalValueFmt.sub && (
                      <SubValue>{totalValueFmt.sub}</SubValue>
                    )}
                  </PriceGroup>
                </Info>

                <Profit $isUp={isUp} $isZero={profitRate === 0} role="status">
                  {profitRate === 0 ? (
                    <>
                      📊 아직 변동이 없어요
                      <TipHint>
                        ⏰ 내일 가격이 어떻게 바뀔지 기대해봐요!
                      </TipHint>
                    </>
                  ) : isUp ? (
                    `📈 +${isUS ? `$${Math.abs(profitAmount).toFixed(2)}` : `${Math.abs(Math.round(profitAmount)).toLocaleString()}원`} (${profitRate.toFixed(1)}%) 올라갔어요!`
                  ) : (
                    `📉 ${isUS ? `$${Math.abs(profitAmount).toFixed(2)}` : `${Math.abs(Math.round(profitAmount)).toLocaleString()}원`} (${profitRate.toFixed(1)}%) 내려갔어요`
                  )}
                  {profitRate !== 0 && (
                    <TipHint>
                      {isUp ? (
                        <>
                          💡 가격이 오르고 있어요! <br />더 사볼지, 팔지,
                          기다릴지 생각해볼까요? 😊
                        </>
                      ) : (
                        <>
                          💡 가격이 내려가고 있어요! <br />
                          기다릴지, 팔지, 더 사볼지 생각해볼까요? 😊
                        </>
                      )}
                    </TipHint>
                  )}
                </Profit>
              </ItemCard>
            );
          })
        )}
      </ListSection>

      <InfoModal
        open={openInfo === "buyPrice"}
        onClose={() => setOpenInfo(null)}
        title="🛒 내가 산 가격"
      >
        내가 산 가격은 주식을 구매했을 때의 가격이에요. 여러 번 다른 가격으로
        사면 평균 가격으로 계산돼요.
      </InfoModal>
      <InfoModal
        open={openInfo === "currentPrice"}
        onClose={() => setOpenInfo(null)}
        title="📈 현재 가격"
      >
        현재 가격은 지금 이 회사 주식 1개의 가격이에요.
      </InfoModal>
      <InfoModal
        open={openInfo === "totalValue"}
        onClose={() => setOpenInfo(null)}
        title="💰 현재 가치"
      >
        현재 가치는 내가 가진 주식 전체 금액이에요. 현재 가격 × 보유 수량으로
        계산돼요.
      </InfoModal>
    </Wrapper>
  );
};

export default PortfolioPage;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  padding: 16px 5px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PageTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 22px;
`;

const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Empty = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  text-align: center;
  font-size: 15px;
`;

const SmallHint = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const GoMarketButton = styled.button`
  margin-top: 15px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: transform 0.15s ease;
  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const ItemCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease;
  &:hover {
    transform: translateY(-2px);
    border: 1px solid ${({ theme }) => theme.colors.primary}20;
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.strong`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const CountryBadge = styled.span<{ $isUS: boolean }>`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ theme, $isUS }) =>
    $isUS ? theme.colors.accentBlue + "20" : theme.colors.accentGreen + "20"};
  color: ${({ theme, $isUS }) =>
    $isUS ? theme.colors.accentBlue : theme.colors.accentGreen};
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const Value = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SubValue = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const ValueHighlight = styled.span`
  font-weight: 800;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 2px 0;
`;

const Profit = styled.div<{ $isUp: boolean; $isZero?: boolean }>`
  font-weight: 800;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $isUp, $isZero }) =>
    $isZero
      ? theme.colors.surface
      : $isUp
        ? theme.colors.up + "15"
        : theme.colors.down + "15"};
  color: ${({ theme, $isUp, $isZero }) =>
    $isZero ? theme.colors.muted : $isUp ? theme.colors.up : theme.colors.down};
`;

const TipBox = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary}10;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  text-align: left;
`;

const TipTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
`;

const TipText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const TipHint = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 4px;
`;
