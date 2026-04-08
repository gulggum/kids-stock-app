/**
 * 마켓 화면 상단에 표시되는 환율 정보 컴포넌트
 *
 * 기능
 * 1️⃣ 현재 환율 표시 (USD → KRW)
 * 2️⃣ 환율 설명 보기 버튼
 * 3️⃣ 클릭 시 교육용 설명 모달
 * 4️⃣ 달러 → 원 계산 예시 제공
 *
 * 현재는 기본 환율값 사용
 * 추후 API 연결 예정
 */

import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router";
import InfoModal from "../InfoModal";
import InfoIcon from "../InfoIcon";

type Props = {
  exchangeRate: number;
};

const ExchangeRateInfo = ({ exchangeRate }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Wrapper>
        <LeftRow>
          <RateText>
            💱 환율 <strong>1달러 = {exchangeRate.toLocaleString()}원</strong>
          </RateText>
          <InfoIcon variant="question" onClick={() => setOpen(true)} />
        </LeftRow>

        {/* 환전 상점 바로가기 버튼 */}
        <ExchangeButton onClick={() => navigate("/exchange")}>
          🏦 환전하기
        </ExchangeButton>
      </Wrapper>

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
    </>
  );
};

export default ExchangeRateInfo;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const LeftRow = styled.div`
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
    box-shadow: none;
  }
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
  text-align: center;
`;
