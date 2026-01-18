import { useParams } from "react-router";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { companyMeta } from "../../data/companyMeta";
import ChartPeriodToggle from "../../components/stock/ChartPeriodToggle";
import { useState } from "react";

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

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

      {/* 📊 차트는 다음 단계에서 추가 */}
      <ChartPeriodToggle value={period} onChange={setPeriod} />
      <InfoBox>📈 가격 그래프가 들어올 자리</InfoBox>
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

export default StockDetail;
