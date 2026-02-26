import styled from "styled-components";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login(); // localStorage 저장
    navigate("/"); // 홈으로 이동
  };

  return (
    <Container>
      <Card>
        <Logo src={logo} alt="KidsStock Logo" />
        <Title>로그인</Title>
        <Input type="text" placeholder="아이디를 입력하세요" />
        <Input type="password" placeholder="비밀번호를 입력하세요" />
        <Button onClick={handleLogin}>로그인</Button>
      </Card>
    </Container>
  );
};
const Container = styled.div`
  width: 100vw;
  height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 90%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.card};
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 400px;
  margin-bottom: -80px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || "#ddd"};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export default LoginPage;
