import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderNav from "../navigation/HeaderNav";
import BottomNav from "../navigation/BottomNav";

const AppLayout = () => {
  return (
    <Layout>
      <HeaderNav />
      <Main>
        <Outlet />
      </Main>
      <BottomNav />
      <Footer>© StockKids</Footer>
    </Layout>
  );
};
const Layout = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
`;

const Main = styled.main`
  padding: 16px;
  padding-bottom: 90px;
`;

const Footer = styled.footer`
  padding: 12px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

export default AppLayout;
