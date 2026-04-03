import styled from "styled-components";
import { usePortfolio } from "../context/PortfolioContext";
import PortfolioSummaryCard from "../components/portfolio/PortfolioSummaryCard";
import { useNavigate } from "react-router";
import { chartMock } from "../data/mock/chartMock";
import { useState } from "react";
import InfoModal from "../components/InfoModal";
import InfoIcon from "../components/InfoIcon";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const toggleInfo = (key: string) => {
    setOpenInfo((prev) => (prev === key ? null : key));
  };
  return (
    <Wrapper>
      {/*  상단 요약 카드 */}
      <TopSection>
        <PageTitle>내 포트폴리오 💼</PageTitle>
        <PortfolioSummaryCard />
      </TopSection>

      {/*  보유 주식 목록 */}
      <ListSection>
        {portfolio.length === 0 ? (
          <Empty>
            아직 구매한 주식이 없어요 🥲
            <SmallHint>마켓에서 첫 투자를 시작해보세요!</SmallHint>
            <GoMarketButton onClick={() => navigate("/market")}>
              📈 마켓 바로가기
            </GoMarketButton>
          </Empty>
        ) : (
          portfolio.map((item) => {
            const chart = chartMock[String(item.id)];

            const currentPrice =
              //7일 차트의 마지막 가격=현재가격
              chart?.["7d"]?.[chart["7d"].length - 1].price ?? item.buyPrice;

            const totalValue = currentPrice * item.quantity;

            const profitRate =
              ((currentPrice - item.buyPrice) / item.buyPrice) * 100;

            const profitAmount = (currentPrice - item.buyPrice) * item.quantity;
            const isUp = profitRate >= 0;

            return (
              <ItemCard
                key={item.id}
                onClick={() => navigate(`/market/${item.id}`)}
              >
                <Title>{item.name}</Title>

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

                  <Value>{item.buyPrice.toLocaleString()}원</Value>
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

                  <Value>{currentPrice.toLocaleString()}원</Value>
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

                  <ValueHighlight>
                    {totalValue.toLocaleString()}원
                  </ValueHighlight>
                </Info>

                <Profit $isUp={isUp}>
                  {isUp ? "📈 +" : "📉 "}
                  {profitAmount.toLocaleString()}원 ( {profitRate.toFixed(1)}% )
                  {isUp ? " 올라갔어요!" : " 내려갔어요"}
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

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
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

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.primary}20;
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

// 회사명
const Title = styled.strong`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

// 한 줄 정보 묶음
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

// 왼쪽 라벨
const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

// 오른쪽 값 (숫자 강조)
const Value = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;
const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 6px 0;
`;

const Profit = styled.div<{ $isUp: boolean }>`
  font-weight: 800;
  font-size: 14px;

  color: ${({ theme, $isUp }) => ($isUp ? theme.colors.up : theme.colors.down)};
`;
const ValueHighlight = styled.span`
  font-weight: 800;
  font-size: 16px;
`;

export default PortfolioPage;
