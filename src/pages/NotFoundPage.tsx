import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Card>
        <ErrorCode>404</ErrorCode>
        <Title>앗! 길을 잃었어요 🧭</Title>
        <Description>
          존재하지 않는 페이지예요.
          <br />
          다시 홈으로 돌아가볼까요?
        </Description>

        <HomeButton onClick={() => navigate("/")}>홈으로 가기</HomeButton>
      </Card>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-bottom: env(safe-area-inset-bottom);
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 40px 32px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
`;

const ErrorCode = styled.h1`
  font-size: 72px;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h2`
  margin-top: 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.6;
  font-size: 14px;
`;

const HomeButton = styled.button`
  margin-top: 24px;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;
export default NotFoundPage;
