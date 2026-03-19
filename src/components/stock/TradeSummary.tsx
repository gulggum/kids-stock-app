import styled from "styled-components";

/**
 * 📌 TradeSummary
 * - 구매 / 판매 요약 UI
 * - ModalPopup customContent용
 */

type Props = {
  type: "BUY" | "SELL";
  money: number;
  price: number;
  name: string;
  buyPrice?: number; //평균 매수가
};

const TradeSummary = ({ type, money, price, name, buyPrice }: Props) => {
  const afterMoney = type === "BUY" ? money - price : money + price;

  // 수익 계산
  const profit = buyPrice !== undefined ? price - buyPrice : 0;

  // 수익률
  const profitRate = buyPrice ? (profit / buyPrice) * 100 : 0;

  return (
    <Wrapper>
      <Header>
        <Section>
          <CompanyName>{name}</CompanyName>
          <AmountInfo>
            <Label>{type === "BUY" ? "구매 금액" : "판매 금액"}</Label>
            <Amount $type={type}>
              {type === "BUY" ? "-" : "+"}
              {price.toLocaleString()}원 {type === "SELL" ? "💰" : ""}
            </Amount>
          </AmountInfo>
        </Section>
      </Header>

      {/* 💸 거래 금액 */}
      {/* 💰 현재 돈 */}
      <Section>
        <Label>나의 잔고</Label>

        <MoneyRow>
          <Before>{money.toLocaleString()}원</Before>
          <Arrow>→</Arrow>
          <After>{afterMoney.toLocaleString()}원</After>
        </MoneyRow>
      </Section>
      {type === "SELL" && buyPrice !== undefined && (
        <>
          <AmountGroup>
            <Section>
              <Label>수익</Label>
              <Amount $type={profit >= 0 ? "SELL" : "BUY"}>
                {profit >= 0 ? "+" : ""}
                {profit.toLocaleString()}원 💰
              </Amount>
            </Section>

            <Section>
              <Label>수익률</Label>
              <Rate $positive={profit >= 0}>
                {profit >= 0 ? "+" : ""}
                {profitRate.toFixed(1)}%
              </Rate>
            </Section>
          </AmountGroup>
        </>
      )}
      {type === "SELL" && <Notice>💡 판매한 돈은 2일 뒤에 들어와요</Notice>}
    </Wrapper>
  );
};

export default TradeSummary;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px 0;
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.surface};
`;

const CompanyName = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const AmountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MoneyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;
`;

const Before = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Arrow = styled.span`
  font-size: 14px;
`;

const After = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;
const AmountGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 10px 0;
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.surface};
`;

const Amount = styled.div<{ $type: "BUY" | "SELL" }>`
  font-size: 16px;
  font-weight: 800;

  color: ${({ $type }) => ($type === "BUY" ? "#e53935" : "#4caf50")};
`;

const Rate = styled.div<{ $positive: boolean }>`
  font-size: 15px;
  font-weight: 800;

  color: ${({ $positive }) => ($positive ? "#4caf50" : "#e53935")};
`;

const Notice = styled.div`
  margin-top: 6px;
  font-size: 12px;

  color: ${({ theme }) => theme.colors.textSecondary};

  text-align: center;
`;
