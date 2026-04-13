// 첫 투자 전 온보딩 팝업
// - hasCompletedFirstBuy가 false일 때만 표시
// - 마켓으로 이동 or 나중에 닫기
// - 다음 접속 때도 첫 구매 전이면 다시 표시

import styled, { keyframes } from "styled-components";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";

type Props = {
  onClose: () => void;
};

const WelcomePopup = ({ onClose }: Props) => {
  const navigate = useNavigate();

  return createPortal(
    <Overlay>
      <Modal>
        <Emoji>🎉</Emoji>
        <Title>키즈스톡에 오신 걸 환영해요!</Title>

        <ContentBox>
          <ContentText>
            <strong>주식</strong>은 회사의 작은 조각을 사는 거예요.
          </ContentText>
          <ContentText>회사가 잘 되면 내 돈도 같이 늘어나요!📈</ContentText>
          <ContentText>
            💰 시작 자금 <strong>100만원</strong>으로 시작해요!
          </ContentText>
        </ContentBox>

        <GuideBox>
          <GuideStep>
            <StepNum>1</StepNum>
            <StepText>마켓에서 어떤 회사들이 있는지 구경해봐요</StepText>
          </GuideStep>
          <GuideStep>
            <StepNum>2</StepNum>
            <StepText>마음에 드는 회사 주식을 사봐요</StepText>
          </GuideStep>
          <GuideStep>
            <StepNum>3</StepNum>
            <StepText>가격이 오르면 팔아서 수익을 내봐요!</StepText>
          </GuideStep>
        </GuideBox>

        <MarketButton
          onClick={() => {
            onClose();
            navigate("/market");
          }}
        >
          🏪 마켓 구경하러 가기
        </MarketButton>

        <LaterButton onClick={onClose}>나중에</LaterButton>
      </Modal>
    </Overlay>,
    document.body,
  );
};

export default WelcomePopup;

/* ================= 스타일 ================= */

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.85) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 24px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  animation: ${popIn} 0.35s ease;
`;

const Emoji = styled.div`
  font-size: 48px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  width: 100%;
`;

const ContentText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const GuideBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const GuideStep = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
`;

const StepNum = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StepText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

const MarketButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 15px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.15s ease;
  &:active {
    transform: scale(0.97);
  }
`;

const LaterButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  font-family: inherit;
  padding: 4px;
`;
