import styled, { keyframes } from "styled-components";
import logo from "../../assets/images/logo.png";
import video from "../../assets/videos/loading1.mp4";

const LoadingScreen = () => {
  return (
    <Container>
      {/* 배경 영상 */}
      <BlurVideo autoPlay muted loop playsInline preload="auto">
        <source src={video} type="video/mp4" />
      </BlurVideo>

      <MainVideo autoPlay muted loop playsInline preload="auto">
        <source src={video} type="video/mp4" />
      </MainVideo>
      <Content>
        <Logo src={logo} alt="KidsStock Logo" />
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
  position: relative;
  width: 100vw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

// 3️⃣ 내부 정렬용 래퍼
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 0.8s ease-in-out;
  animation-delay: 0.8s; /* ✅ 이만큼 늦게 시작 */
  animation-fill-mode: both;
`;

// 4️⃣ 로고 스타일
const Logo = styled.img`
  width: 85%;
  max-width: 520px;
  min-width: 280px;
  margin-bottom: 24px;
`;

const BlurVideo = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(60px);
  transform: scale(1.2);
  backface-visibility: hidden;
  transform: translateZ(0);
`;

const MainVideo = styled.video`
  position: fixed; // 🔥 중요
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  backface-visibility: hidden;
  transform: translateZ(0);
`;

export default LoadingScreen;
