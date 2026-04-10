/**
 * 마켓 화면 상단에 표시되는 환율 정보 컴포넌트
 *
 * 기능
 * 1️⃣ 현재 환율 표시 (USD → KRW)
 * 2️⃣ 환율 설명 보기 버튼
 * 3️⃣ 클릭 시 교육용 설명 모달
 * 4️⃣ 달러 → 원 계산 예시 제공
 */

import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router";
import InfoModal from "../InfoModal";
import InfoIcon from "../InfoIcon";
import { useUser } from "../../context/UserContext";

type Props = {
  exchangeRate: number;
};

const ExchangeRateInfo = ({ exchangeRate }: Props) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [openMarket, setOpenMarket] = useState(false);

  return (
    <>
      <Wrapper>
        {/* 환율 + 환전 버튼 */}
        <TopRow>
          <RateRow>
            <RateText>
              💱 <strong>1달러 = {exchangeRate.toLocaleString()}원</strong>
            </RateText>
            <InfoIcon variant="question" onClick={() => setOpen(true)} />
          </RateRow>
          <ExchangeButton onClick={() => navigate("/exchange")}>
            🏦 환전하기
          </ExchangeButton>
        </TopRow>

        {/* 업데이트 안내 — 환율 바로 아래 왼쪽 정렬 */}
        <UpdateRow>
          <UpdateNotice>
            📢 주식이랑 환율은 매일 아침 8~9시에 함께 바뀌어요!
          </UpdateNotice>
          <InfoIcon variant="question" onClick={() => setOpenMarket(true)} />
        </UpdateRow>

        {/* 원화 / 달러 잔액 */}
        <WalletRow>
          <WalletItem>
            <WalletFlag>🇰🇷</WalletFlag>
            <WalletAmount>{user.money.toLocaleString()}원</WalletAmount>
          </WalletItem>
          <WalletDivider />
          <WalletItem>
            <WalletFlag>🇺🇸</WalletFlag>
            <WalletAmount $isDollar>
              ${(user.dollars ?? 0).toLocaleString()}
            </WalletAmount>
          </WalletItem>
        </WalletRow>
      </Wrapper>
      {/* 환율 안내 모달 */}
      {open && (
        <InfoModal open={open} onClose={() => setOpen(false)}>
          <ModalContent>
            <Title>💱 환율이란?</Title>
            <Description>
              환율은 <strong>다른 나라 돈을 우리나라 돈으로 바꾸는 비율</strong>
              이에요.
            </Description>
            <ExampleCard>
              <ExampleTitle>📊 계산 예시</ExampleTitle>
              <ExampleText>
                1달러 = {exchangeRate.toLocaleString()}원
              </ExampleText>
              <ExampleText>Apple 주식이 $175라면</ExampleText>
              <ExampleResult>
                175 × {exchangeRate} = {(175 * exchangeRate).toLocaleString()}원
              </ExampleResult>
              <Hint>
                💡 달러가 올라가면 미국 주식 가격도 더 비싸질 수 있어요!
              </Hint>
            </ExampleCard>
          </ModalContent>
        </InfoModal>
      )}
      {/* 주식시장 시간안내 모달 */}
      {openMarket && (
        <InfoModal
          open={openMarket}
          onClose={() => setOpenMarket(false)}
          title="📈 주식 시장은 언제 열릴까요 ?"
        >
          <MarketInfo>
            <MarketRow>
              <MarketFlag>🇰🇷</MarketFlag>
              <MarketText>
                <MarketName>한국 주식시장</MarketName>
                <MarketTime>오전 9시 ~ 오후 3시 30분</MarketTime>
                <MarketSub>이 시간에만 주식을 사고 팔 수 있어요!</MarketSub>
              </MarketText>
            </MarketRow>
            <MarketRow>
              <MarketFlag>🇺🇸</MarketFlag>
              <MarketText>
                <MarketName>미국 주식시장</MarketName>
                <MarketTime>밤 11시 30분 ~ 새벽 6시</MarketTime>
                <MarketSub>한국과 시간이 달라서 밤에 열려요!</MarketSub>
              </MarketText>
            </MarketRow>
            <InfoNote>
              <InfoTitle>
                <Icon>✋</Icon>
                잠깐!
              </InfoTitle>
              <Text>
                <strong>실제로는 주식 가격과 환율이 계속 바뀌어요.</strong>
                <br />
                키즈스톡에서는 이해하기 쉽게 하루에 한 번, <br />
                아침 8~9시에 함께 바뀌어요!
              </Text>
            </InfoNote>
          </MarketInfo>
        </InfoModal>
      )}
    </>
  );
};

export default ExchangeRateInfo;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RateText = styled.div``;

const ExchangeButton = styled.button`
  padding: 7px 14px;
  border: none;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  &:active {
    transform: scale(0.96);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
const UpdateNotice = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: left;
`;
const WalletRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const WalletItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
`;

const WalletFlag = styled.span`
  font-size: 16px;
`;

const WalletAmount = styled.span<{ $isDollar?: boolean }>`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme, $isDollar }) =>
    $isDollar ? theme.colors.accentGreen : theme.colors.primary};
`;

const WalletDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 8px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
`;

const Description = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const ExampleCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
`;

const ExampleTitle = styled.div`
  font-weight: 700;
`;
const ExampleText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const ExampleResult = styled.div`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;
const Hint = styled.div`
  margin-top: 6px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(0, 0, 0, 0.03);
  color: ${({ theme }) => theme.colors.textSecondary};
`;

//설명모달스타일
const UpdateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MarketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
`;

const MarketRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const MarketFlag = styled.span`
  font-size: 24px;
`;

const MarketText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MarketName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const MarketTime = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const MarketSub = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;
const InfoNote = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};

  background: rgba(59, 130, 246, 0.08);
`;

const InfoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Icon = styled.span`
  font-size: 16px;
`;

const Text = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;
