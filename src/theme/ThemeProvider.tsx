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
      accentGreen: string;
      accentPurple: string;
      accentPink: string;

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
    // 🌟 메인 브랜드 컬러 (로고 K 블루)
    primary: "#2E8EDB",

    // 🟠 보조 (로고 오렌지)
    secondary: "#F39C12",

    // 💛 메인 배경 (로고 노랑 톤)
    background: "#f5f7fb",

    // 카드 & 레이어
    surface: "#FFF9DB",
    card: "#fff",
    border: "#E6C84F",

    // 🎨 로고 컬러 확장
    accentBlue: "#3B82F6",
    accentGreen: "#6BCB3D",
    accentPurple: "#9B59B6",
    accentPink: "#FF8FA3",

    // 📈 주식 컬러 (아이들 친화적으로 너무 강하지 않게)
    up: "#4CAF50",
    down: "#E74C3C",

    // ✏️ 텍스트 (로고 아웃라인 네이비 기반)
    text: "#1F3A5F",
    textSecondary: "#2C4A73",
    muted: "#5F7FA6",
  },

  fonts: {
    base: "'Noto Sans KR', 'Segoe UI', Roboto, sans-serif",
    title: "'Fredoka', 'Noto Sans KR', sans-serif",
  },

  radius: {
    sm: "14px",
    md: "20px",
    lg: "28px",
  },

  shadows: {
    sm: "0 8px 20px rgba(31,58,95,0.12)",
    md: "0 14px 35px rgba(31,58,95,0.18)",
  },
};

// -----------------------------
// Optional 'day' / 'clean' theme (for parents or alt-mode)
export const cleanTheme: DefaultTheme = {
  name: "clean",
  colors: {
    // 🔵 신뢰 중심 딥 블루 (브랜드 연결)
    primary: "#1D4ED8",
    secondary: "#3B82F6",

    // 🤍 차분한 배경
    background: "#F5F7FB",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E2E8F0",

    // 🎨 브랜드 연결 포인트
    accentBlue: "#2563EB",
    accentPurple: "#7C3AED",
    accentGreen: "#16A34A", // ✔ 추가 (신뢰감 있는 그린)
    accentPink: "#EC4899",

    // 📈 주식 컬러 (조금 더 전문적)
    up: "#15803D",
    down: "#B91C1C",

    // 🖋 텍스트 (조금 더 묵직하게)
    text: "#0B1F3A",
    textSecondary: "#334155",
    muted: "#64748B",
  },

  fonts: kidTheme.fonts,
  radius: {
    sm: "10px",
    md: "14px",
    lg: "18px",
  },
  shadows: {
    sm: "0 4px 12px rgba(15,23,42,0.06)",
    md: "0 8px 24px rgba(15,23,42,0.10)",
  },
};

// -----------------------------
// Global styles (reset + base)
export const GlobalStyle = createGlobalStyle`
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; }
body {
margin: 0 ;
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
