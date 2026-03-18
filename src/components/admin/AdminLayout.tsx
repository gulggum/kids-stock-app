import { Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { cleanTheme, GlobalStyle } from "../../theme/ThemeProvider";

/**
 * 관리자 페이지 전체 레이아웃
 *
 * PC
 *  Sidebar + Header + Content
 *
 * Mobile
 *  Header
 *  Content
 *  Sidebar (slide menu)
 */

const AdminLayout = () => {
  // ⭐ 모바일 sidebar 열림 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={cleanTheme}>
      <GlobalStyle />
      <Layout>
        {/* 모바일 overlay */}
        {sidebarOpen && <Overlay onClick={() => setSidebarOpen(false)} />}

        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <Content>
          {/* Header에서 sidebar 열기 */}
          <AdminHeader setOpen={setSidebarOpen} />

          <Main>
            <Outlet />
          </Main>
        </Content>
      </Layout>
    </ThemeProvider>
  );
};

const Layout = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 32px;

  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

/**
 * 모바일에서 사이드바 열리면 뒤에 어둡게 처리
 */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;

  @media (min-width: 768px) {
    display: none;
  }
`;

export default AdminLayout;
