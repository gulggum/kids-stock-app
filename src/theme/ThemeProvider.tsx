/**
 * 📍 파일 위치: src/theme/ThemeProvider.tsx
 * - GlobalStyle (전역 스타일)
 * - kid / clean 테마
 * - AppThemeProvider (ThemeProvider 래퍼)
 */

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
  type DefaultTheme,
} from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    name: string; // kid | clean
    colors: {
      primary: string;
      secondary: string;

      background: string;
      surface: string;
      card: string;
      border: string;

      accentBlue: string;
      accentPurple: string;

      up: string;
      down: string;

      text: string;
      textSecondary: string;
      muted: string;
    };
    fonts: {
      base: string;
      title: string;
    };
    radius: {
      sm: string;
      md: string;
      lg: string;
    };
    shadows: {
      sm: string;
      md: string;
    };
  }
}

// -----------------------------
// Kid-friendly (default) theme
export const kidTheme: DefaultTheme = {
  name: "kid",
  colors: {
    primary: "#FFB703", // 메인 노랑
    secondary: "#FB8500", // 오렌지

    background: "#FFF6E5", // 따뜻한 배경
    surface: "#FFFFFF",
    card: "#FFE8C7",
    border: "#F3D9A6",

    accentBlue: "#8ECAE6",
    accentPurple: "#B48CF2",

    up: "#4CAF50",
    down: "#E76F51",

    text: "#3A2E2E",
    textSecondary: "#6B5E57",
    muted: "#9A8F87",
  },
  fonts: {
    base: "'Noto Sans KR', 'Segoe UI', Roboto, sans-serif",
    title: "'Fredoka', 'Noto Sans KR', sans-serif",
  },
  radius: {
    sm: "12px",
    md: "18px",
    lg: "24px",
  },
  shadows: {
    sm: "0 8px 20px rgba(0,0,0,0.08)",
    md: "0 12px 30px rgba(0,0,0,0.12)",
  },
};

// -----------------------------
// Optional 'day' / 'clean' theme (for parents or alt-mode)
export const cleanTheme: DefaultTheme = {
  name: "clean",
  colors: {
    primary: "#2563EB",
    secondary: "#60A5FA",

    background: "#F8FAFF",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E5E7EB",

    accentBlue: "#60A5FA",
    accentPurple: "#A78BFA",

    up: "#16A34A",
    down: "#DC2626",

    text: "#0F172A",
    textSecondary: "#475569",
    muted: "#94A3B8",
  },
  fonts: kidTheme.fonts,
  radius: kidTheme.radius,
  shadows: kidTheme.shadows,
};

// -----------------------------
// Global styles (reset + base)
export const GlobalStyle = createGlobalStyle`
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; }
body {
margin: 0;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
font-family: ${(props) => props.theme.fonts.base};
background: ${(props) => props.theme.colors.background};
color: ${(props) => props.theme.colors.text};
line-height: 1.4;
font-size: 16px;
}


/* Accessibility helpers */
a { color: inherit; text-decoration: none; }
button { font-family: inherit; }


/* Kid-friendly default button 공용클래스(디자인 통일용) */
.ks-btn {
display: inline-flex;
align-items: center;
justify-content: center;
gap: 8px;
padding: 10px 14px;
border-radius: ${(props) => props.theme.radius.md};
border: none;
cursor: pointer;
background: ${(props) => props.theme.colors.primary};
color: white;
box-shadow: ${(props) => props.theme.shadows.sm};
transition: transform .12s ease, box-shadow .12s ease;
}
.ks-btn:active { transform: translateY(1px); }


/* Cards */
.ks-card {
background: ${(props) => props.theme.colors.card};
border-radius: ${(props) => props.theme.radius.lg};
padding: 12px;
box-shadow: ${(props) => props.theme.shadows.sm};
}


/* Small helper utilities */
.ks-muted { color: ${(props) => props.theme.colors.muted}; }
`;

// -----------------------------
// Theme context & provider wrapper
type AppThemeProviderProps = {
  children: ReactNode;
  initial?: "kid" | "clean";
};

//테마 토글용 상태
const ToggleThemeContext = createContext<
  { themeName: string; toggle: () => void } | undefined
>(undefined);

export const useAppTheme = () => {
  const ctx = useContext(ToggleThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
  initial = "kid",
}) => {
  const [themeName, setThemeName] = useState<string>(initial);
  const theme = themeName === "kid" ? kidTheme : cleanTheme;

  const toggle = () => setThemeName((t) => (t === "kid" ? "clean" : "kid"));

  //앱 전체 테마 + 글로벌 스타일 적용
  return (
    <ToggleThemeContext.Provider value={{ themeName, toggle }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ToggleThemeContext.Provider>
  );
};

export default AppThemeProvider;
