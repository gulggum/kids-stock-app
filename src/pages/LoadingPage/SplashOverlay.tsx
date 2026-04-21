import styled, { keyframes } from "styled-components";
import logo from "../../assets/images/logo.png";

const SplashScreen = () => {
  return (
    <Container>
      <Logo src={logo} alt="KidsStock Logo" />
    </Container>
  );
};

export default SplashScreen;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 90vw;
  max-width: 900px;
  animation: ${fadeIn} 0.8s ease-in-out;
`;
