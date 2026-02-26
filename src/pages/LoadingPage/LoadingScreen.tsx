import styled, { keyframes } from "styled-components";
import logo from "../assets/images/logo.png"; // 경로 맞게 수정

const LoadingScreen = () => {
  return (
    <Container>
      <Content>
        <Logo src={logo} alt="KidsStock Logo" />
        <DotWrapper>
          <Dot />
          <Dot />
          <Dot />
        </DotWrapper>
      </Content>
    </Container>
  );
};

// 1️⃣ 부드럽게 떠오르는 애니메이션
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 2️⃣ 배경 컨테이너
const Container = styled.div`
  width: 100vw;
  height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

// 3️⃣ 내부 정렬용 래퍼
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 0.8s ease-in-out;
`;

// 4️⃣ 로고 스타일
const Logo = styled.img`
  width: 85%;
  max-width: 520px;
  min-width: 280px;
  margin-bottom: 24px;
`;

// 5️⃣ 로딩 점 애니메이션
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 
  40% {
    transform: scale(1);
  }
`;

const DotWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
`;

export default LoadingScreen;
