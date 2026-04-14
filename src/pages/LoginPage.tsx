import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { generateNickname } from "../utils/nickname";
import { isValidNickname } from "../utils/nicknameFilter";
import { checkNicknameDuplicate } from "../services/userService";
import logo from "../assets/images/logo.png";
import bgImage from "../assets/images/bgImage.png";
import { useToast } from "../context/UIContext/ToastContext";
import { supabase } from "../utils/supabase";

type Mode = "select" | "guest" | "email" | "reset";
type EmailMode = "login" | "signup";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, startGuest } = useUser();
  const { createToast } = useToast();

  // 메인 모드: 선택화면 / 게스트 / 이메일
  const [mode, setMode] = useState<Mode>("select");

  // 이메일 모드: 로그인 / 회원가입
  const [emailMode, setEmailMode] = useState<EmailMode>("login");

  // 게스트 입력값
  const [guestNickname, setGuestNickname] = useState("");
  const [guestNicknameStatus, setGuestNicknameStatus] = useState<{
    type: "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });

  // 이메일 입력값
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState<{
    type: "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────────────────────────────────
  // 게스트 닉네임 자동 추천
  // ─────────────────────────────────────────
  const handleGenerateNickname = (
    setNick: (n: string) => void,
    setStatus: (s: {
      type: "error" | "success" | null;
      message: string;
    }) => void,
  ) => {
    const generated = generateNickname();
    setNick(generated);
    setStatus({ type: "success", message: "사용 가능한 닉네임이에요 ✓" });
  };

  // ─────────────────────────────────────────
  // 게스트 시작
  // ─────────────────────────────────────────
  const handleGuestStart = async () => {
    if (!guestNickname.trim()) {
      setGuestNicknameStatus({
        type: "error",
        message: "닉네임을 입력해주세요",
      });
      return;
    }
    if (guestNickname.trim().length < 2) {
      setGuestNicknameStatus({
        type: "error",
        message: "닉네임은 2글자 이상이에요",
      });
      return;
    }
    if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(guestNickname)) {
      setGuestNicknameStatus({
        type: "error",
        message: "올바른 닉네임을 입력해주세요",
      });
      return;
    }

    if (!isValidNickname(guestNickname)) {
      setGuestNicknameStatus({
        type: "error",
        message: "사용할 수 없는 닉네임이에요",
      });
      return;
    }
    //닉네임 중복방지
    const isDuplicate = await checkNicknameDuplicate(guestNickname);
    if (isDuplicate) {
      setGuestNicknameStatus({
        type: "error",
        message: "이미 사용 중인 닉네임이에요",
      });
      return;
    }

    // Supabase 익명 계정 생성 후 시작
    // 캐시 지워도 데이터 유지됨
    await startGuest(guestNickname);
    navigate("/");
  };

  // ─────────────────────────────────────────
  // 닉네임 실시간 욕설 필터
  // ─────────────────────────────────────────
  const handleNicknameChange = (
    value: string,
    setNick: (n: string) => void,
    setStatus: (s: {
      type: "error" | "success" | null;
      message: string;
    }) => void,
  ) => {
    setNick(value);
    if (!value) {
      setStatus({ type: null, message: "" });
      return;
    }
    // ✅ 2글자 미만
    if (value.trim().length < 2) {
      setStatus({ type: "error", message: "닉네임은 2글자 이상이에요" });
      return;
    }
    // ✅ 초성만 입력 방지 (ㄱ~ㅎ, ㅏ~ㅣ)
    if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(value)) {
      setStatus({ type: "error", message: "올바른 닉네임을 입력해주세요" });
      return;
    }
    if (!isValidNickname(value)) {
      setStatus({ type: "error", message: "사용할 수 없는 닉네임이에요" });
    } else {
      setStatus({ type: null, message: "" });
    }
  };

  // ─────────────────────────────────────────
  // 이메일 로그인/회원가입
  // ─────────────────────────────────────────
  const handleEmailSubmit = async () => {
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요");
      setIsLoading(false);
      return;
    }
    // ✅ 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("올바른 이메일 형식이 아니에요 (예: test@gmail.com)");
      setIsLoading(false);
      return;
    }

    // ✅ 비밀번호 길이 체크
    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요");
      setIsLoading(false);
      return;
    }

    if (emailMode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        setError("이메일 또는 비밀번호가 틀렸어요");
      } else {
        createToast("👋 환영해요! 주식 놀이터에서 재미있게 시작해보세요!");
        navigate("/");
      }
    } else {
      if (!nickname) {
        setError("닉네임을 입력해주세요");
        setIsLoading(false);
        return;
      }

      if (!isValidNickname(nickname)) {
        setError("사용할 수 없는 닉네임이에요");
        setIsLoading(false);
        return;
      }

      const isDuplicate = await checkNicknameDuplicate(nickname);
      if (isDuplicate) {
        setError("이미 사용 중인 닉네임이에요");
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(email, password, nickname);
      if (error) {
        setError("회원가입에 실패했어요. 다시 시도해주세요");
      } else {
        createToast("🎉 가입 완료!");
        setEmailMode("login");
        setMode("select");
      }
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEmailSubmit();
  };

  const handleResetPassword = async () => {
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("올바른 이메일 형식이 아니에요");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("이메일 전송에 실패했어요. 다시 시도해주세요");
    } else {
      createToast("📧 재설정 링크를 보냈어요!");
      setMode("email");
      setEmail("");
    }

    setIsLoading(false);
  };

  // ─────────────────────────────────────────
  // 렌더링
  // ─────────────────────────────────────────
  return (
    <Container>
      <Card>
        <Logo src={logo} alt="KidsStock Logo" />

        {/* ── 선택 화면 ── */}
        {mode === "select" && (
          <>
            <SubDesc>
              <span style={{ fontSize: "14px" }}>⭐</span>
              쉽고 재밌는 주식 놀이터
            </SubDesc>
            <SmallDesc>가볍게 시작하는 주식 체험 앱</SmallDesc>
            <GuestButton onClick={() => setMode("guest")}>
              게스트로 시작하기
            </GuestButton>
            <Divider>또는</Divider>
            <EmailButton onClick={() => setMode("email")}>
              이메일로 로그인
            </EmailButton>
            <BottomDesc>닉네임만 있으면 바로 시작!</BottomDesc>
          </>
        )}

        {/* ── 게스트 화면 ── */}
        {mode === "guest" && (
          <>
            <SubTitle>닉네임을 정해봐요!</SubTitle>
            <NicknameWrapper>
              <NicknameInput
                type="text"
                placeholder="닉네임 입력"
                value={guestNickname}
                onChange={(e) =>
                  handleNicknameChange(
                    e.target.value,
                    setGuestNickname,
                    setGuestNicknameStatus,
                  )
                }
                onKeyDown={(e) => e.key === "Enter" && handleGuestStart()}
                $status={guestNicknameStatus.type}
                autoFocus
              />
              <GenerateButton
                type="button"
                onClick={() =>
                  handleGenerateNickname(
                    setGuestNickname,
                    setGuestNicknameStatus,
                  )
                }
                title="닉네임 자동 추천"
              >
                🎲
              </GenerateButton>
            </NicknameWrapper>

            {guestNicknameStatus.message && (
              <StatusText $type={guestNicknameStatus.type}>
                {guestNicknameStatus.message}
              </StatusText>
            )}

            <Notice>
              💡 게스트 기록은 자동으로 저장돼요
              <br />
              이메일로 가입하면 다른 기기에서도 사용 가능해요
            </Notice>

            <Button onClick={handleGuestStart}>시작하기!</Button>
            <BackButton onClick={() => setMode("select")}>← 뒤로</BackButton>
          </>
        )}

        {/* ── 이메일 화면 ── */}
        {mode === "email" && (
          <>
            <TabWrapper>
              <Tab
                $active={emailMode === "login"}
                onClick={() => setEmailMode("login")}
              >
                로그인
              </Tab>
              <Tab
                $active={emailMode === "signup"}
                onClick={() => setEmailMode("signup")}
              >
                회원가입
              </Tab>
            </TabWrapper>

            {emailMode === "signup" && (
              <>
                <NicknameWrapper>
                  <NicknameInput
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChange={(e) =>
                      handleNicknameChange(
                        e.target.value,
                        setNickname,
                        setNicknameStatus,
                      )
                    }
                    onKeyDown={handleKeyDown}
                    $status={nicknameStatus.type}
                  />
                  <GenerateButton
                    type="button"
                    onClick={() =>
                      handleGenerateNickname(setNickname, setNicknameStatus)
                    }
                  >
                    🎲
                  </GenerateButton>
                </NicknameWrapper>
                {nicknameStatus.message && (
                  <StatusText $type={nicknameStatus.type}>
                    {nicknameStatus.message}
                  </StatusText>
                )}
              </>
            )}
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {error && <ErrorText>{error}</ErrorText>}

            <Button onClick={handleEmailSubmit} disabled={isLoading}>
              {isLoading
                ? "처리 중..."
                : emailMode === "login"
                  ? "로그인"
                  : "회원가입"}
            </Button>

            {emailMode === "login" && (
              <ForgotButton onClick={() => setMode("reset")}>
                비밀번호를 잊으셨나요?
              </ForgotButton>
            )}
            <BackButton onClick={() => setMode("select")}>← 뒤로</BackButton>
          </>
        )}

        {/* ──비밀번호 찾기 화면── */}
        {mode === "reset" && (
          <>
            <SubTitle>비밀번호 찾기</SubTitle>
            <Input
              type="email"
              placeholder="가입한 이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
            />
            {error && <ErrorText>{error}</ErrorText>}
            <Button onClick={handleResetPassword} disabled={isLoading}>
              {isLoading ? "전송 중..." : "재설정 링크 보내기"}
            </Button>
            <BackButton onClick={() => setMode("email")}>← 뒤로</BackButton>
          </>
        )}
      </Card>
    </Container>
  );
};

// ─────────────────────────────────────────
// 스타일
// ─────────────────────────────────────────

const Container = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 90%;
  max-width: 420px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 400px;
  margin-bottom: -60px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

const GuestButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  transition: 0.2s;
  margin-top: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const EmailButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}11;
  }
`;

const Divider = styled.div`
  width: 100%;
  text-align: center;
  color: #aaa;
  font-size: 13px;
  margin: 12px 0;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #ddd;
  }
  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

const Notice = styled.p`
  font-size: 12px;
  color: #888;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 24px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: 0.2s;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "#eee"};
  color: ${({ $active }) => ($active ? "white" : "#888")};
`;

const NicknameWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
`;

const NicknameInput = styled.input<{ $status: "error" | "success" | null }>`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid
    ${({ $status, theme }) =>
      $status === "error"
        ? "#e74c3c"
        : $status === "success"
          ? "#2ecc71"
          : theme.colors.border || "#ddd"};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GenerateButton = styled.button`
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || "#ddd"};
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const StatusText = styled.p<{ $type: "error" | "success" | null }>`
  width: 100%;
  font-size: 12px;
  margin-bottom: 10px;
  color: ${({ $type }) => ($type === "error" ? "#e74c3c" : "#2ecc71")};
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

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 13px;
  margin-bottom: 10px;
  text-align: center;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  margin-top: 12px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: #888;
  }
`;

const SubDesc = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff5db;
  border-radius: 20px;
  padding: 5px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #c47c00;
  margin-bottom: 16px;
`;

const SmallDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: -8px;
  margin-bottom: 16px;
  text-align: center;
`;

const BottomDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 12px;
  text-align: center;
`;

const ForgotButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  cursor: pointer;
  margin-top: 4px;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default LoginPage;
