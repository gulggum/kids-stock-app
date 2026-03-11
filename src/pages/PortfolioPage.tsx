import styled from "styled-components";
import { usePortfolio } from "../context/PortfolioContext";
import PortfolioSummaryCard from "../components/portfolio/PortfolioSummaryCard";
import { useNavigate } from "react-router";
import { chartMock } from "../data/mock/chartMock";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();

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
                  <Label>내가 산 가격</Label>
                  <Value>{item.buyPrice.toLocaleString()}원</Value>
                </Info>

                <Divider />

                <Info>
                  <Label>지금 가격</Label>
                  <Value>{currentPrice.toLocaleString()}원</Value>
                </Info>

                <Info>
                  <Label>지금 가치 💰</Label>
                  <Value>{totalValue.toLocaleString()}원</Value>
                </Info>

                <Profit $isUp={isUp}>
                  {isUp ? "📈 +" : "📉 "}
                  {profitRate.toFixed(1)}%
                  {isUp ? " 올라갔어요!" : " 내려갔어요"}
                </Profit>
              </ItemCard>
            );
          })
        )}
      </ListSection>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
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
  margin-top: 6px;

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
export default PortfolioPage;
