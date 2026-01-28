import styled from "styled-components";
import { useAppTheme } from "../theme/ThemeProvider";

const ToggleWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: none;
  cursor: pointer;

  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  font-size: 14px;
  font-weight: 600;

  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }
`;

const Icon = styled.span`
  font-size: 18px;
`;

export default function ThemeToggleButton() {
  const { themeName, toggle } = useAppTheme();

  return (
    <ToggleWrapper onClick={toggle} aria-label="테마 변경">
      <Icon>{themeName === "kid" ? "🧒" : "🧑‍💼"}</Icon>
      {themeName === "kid" ? "부모모드" : "키즈모드"}
    </ToggleWrapper>
  );
}
