// 📌 StockPriceSection
// - 종목의 현재 가격과 등락률(▲/▼)을 표시
// - 상승/하락 여부에 따라 색상 분기

import styled from "styled-components";
import { usdToKrw } from "../../utils/currency";

type Props = {
  price: number;
  changeRate: number;
  country?: "KR" | "US";
};

const StockPriceSection = ({ price, changeRate, country }: Props) => (
  <PriceSection>
    <PriceInfo>
      <PriceLabel>현재 가격</PriceLabel>
      <PriceValue>
        {" "}
        {country === "US" ? (
          <>
            ${price.toLocaleString()}
            <SubPrice>({usdToKrw(price, 1350).toLocaleString()}원)</SubPrice>
          </>
        ) : (
          `${price.toLocaleString()}원`
        )}
      </PriceValue>
    </PriceInfo>
    <ChangeRate $positive={changeRate >= 0}>
      {changeRate >= 0 ? "▲" : "▼"} {Math.abs(changeRate)}%
    </ChangeRate>
  </PriceSection>
);

export default StockPriceSection;

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
const SubPrice = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const ChangeRate = styled.div<{ $positive: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.up : theme.colors.down};
`;
