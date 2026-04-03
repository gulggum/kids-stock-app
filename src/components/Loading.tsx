import styled, { keyframes } from "styled-components";

const Loading = () => {
  return (
    <Wrapper>
      <Card>
        <Spinner />
        <Text>불러오는 중이에요...</Text>
      </Card>
    </Wrapper>
  );
};

export default Loading;

// 애니메이션
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    #dcfce7 0%,
    /* 민트 */ #fef9c3 50%,
    /* 연노랑 */ #f0fdf4 100%
  );
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 28px 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Text = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;
