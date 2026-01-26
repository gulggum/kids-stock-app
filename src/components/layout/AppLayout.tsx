import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderNav from "../navigation/HeaderNav";
import BottomNav from "../navigation/BottomNav";
import { useBadge } from "../../context/BadgeContext";
import ModalPopup from "../common/ModalPopup";
import { BADGES } from "../../data/badges";

const AppLayout = () => {
  const { popupBadge, closePopupBadge } = useBadge();
  const badgeMeta = popupBadge ? BADGES[popupBadge] : null;
  return (
    <Layout>
      <HeaderNav />
      <Main>
        {/* 🏅 배지 획득 팝업 */}
        {badgeMeta && (
          <ModalPopup
            title={`${badgeMeta.emoji} ${badgeMeta.title}`}
            message={badgeMeta.description}
            onConfirm={closePopupBadge}
          />
        )}
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
