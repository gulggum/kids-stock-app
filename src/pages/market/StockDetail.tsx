import { useParams } from "react-router";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { companyMeta } from "../../data/companyMeta";
import ChartPeriodToggle from "../../components/stock/ChartPeriodToggle";
import { useState } from "react";
import { companyExplain } from "../../data/companyExplain";

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const explain = companyExplain[Number(id)];

  if (!id || !companyMeta[id]) {
    return <div>회사를 찾을 수 없어요 🥲</div>;
  }
  const company = companyMeta[id];

  return (
    <Wrapper>
      {/* 🔙 뒤로가기 */}
      <BackButton onClick={() => navigate(-1)}>← 돌아가기</BackButton>
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
          {company.changeRate >= 0 ? "▲" : "▼"} {Math.abs(company.changeRate)}%
        </ChangeRate>
      </PriceSection>
      {/* 📊 차트 영역 */}
      <ChartSection>
        <ChartHeader>
          <ChartTitle>가격 변화</ChartTitle>
          <ChartPeriodToggle value={period} onChange={setPeriod} />
        </ChartHeader>

        {/* 차트 컴포넌트 자리 */}
        <ChartPlaceholder>📈 여기에 차트가 들어와요</ChartPlaceholder>
      </ChartSection>
      {/* 💡 설명 카드 */}
      <ExplainCard>
        <ExplainTitle>{explain?.title}</ExplainTitle>
        <ExplainText>{explain?.text}</ExplainText>
      </ExplainCard>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BackButton = styled.button`
  align-self: flex-start;
  border: none;
  background: none;
  font-size: 14px;
  cursor: pointer;
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
   📊 차트 영역
   ========================= */

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
export default StockDetail;
