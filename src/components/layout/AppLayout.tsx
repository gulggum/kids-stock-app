import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderNav from "../navigation/HeaderNav";
import BottomNav from "../navigation/BottomNav";
import { useBadge } from "../../context/UserContext/BadgeContext";
import ModalPopup from "../ModalPopup";
import { BADGES } from "../../data/static/badges";
import { useModal } from "../../context/UIContext/ModalContext";

const AppLayout = () => {
  const { popupBadge, closePopupBadge } = useBadge();
  const badgeMeta = popupBadge ? BADGES[popupBadge] : null;
  const { modal, closeModal } = useModal();
  return (
    <Layout>
      <HeaderNav />
      <Main>
        {modal && (
          <ModalPopup
            {...modal}
            onConfirm={() => {
              modal.onConfirm?.();
              closeModal();
            }}
            onCancel={
              modal.type === "CONFIRM"
                ? () => {
                    modal.onCancel?.();
                    closeModal();
                  }
                : undefined //✔ CONFIRM일 때만 취소버튼 생김
            }
          />
        )}
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
