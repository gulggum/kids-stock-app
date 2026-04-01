import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useToast } from "../context/UIContext/ToastContext";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { createToast } = useToast();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 이메일 링크로 들어온 경우 세션 자동 설정
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      // 이메일 링크 클릭 시 PASSWORD_RECOVERY 이벤트 발생
      if (event === "PASSWORD_RECOVERY") {
        // 세션 자동으로 설정됨, 아무것도 안 해도 됨
      }
    });
  }, []);

  const handleReset = async () => {
    setError(null);

    if (!password || !passwordConfirm) {
      setError("비밀번호를 입력해주세요");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError("비밀번호 변경에 실패했어요. 다시 시도해주세요");
    } else {
      createToast("🎉 비밀번호가 변경됐어요!");
      navigate("/login");
    }

    setIsLoading(false);
  };

  return (
    <Container>
      <Card>
        <Title>새 비밀번호 설정</Title>
        <SubTitle>새로운 비밀번호를 입력해주세요</SubTitle>

        <Input
          type="password"
          placeholder="새 비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleReset()}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <Button onClick={handleReset} disabled={isLoading}>
          {isLoading ? "변경 중..." : "비밀번호 변경하기"}
        </Button>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
`;

const Card = styled.div`
  width: 90%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.card};
  padding: 40px 30px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const SubTitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || "#ddd"};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  margin: 0;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  margin-top: 8px;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default ResetPasswordPage;
