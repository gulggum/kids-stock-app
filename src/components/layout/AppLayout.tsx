import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderNav from "../navigation/HeaderNav";
import BottomNav from "../navigation/BottomNav";
import ModalPopup from "../ModalPopup";
import { useModal } from "../../context/UIContext/ModalContext";
import { useAchievement } from "../../context/AchievementContext/AchievementContext";
import { ACHIEVEMENTS } from "../../data/rules/achievementRules";

const AppLayout = () => {
  const { popupAchievement, closePopupAchievement } = useAchievement();
  const achievementMeta = popupAchievement
    ? ACHIEVEMENTS.find((a) => a.id === popupAchievement)
    : null;
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
        {achievementMeta && (
          <ModalPopup
            title={`${achievementMeta.badge.emoji} ${achievementMeta.badge.title}`}
            message={achievementMeta.badge.description}
            onConfirm={closePopupAchievement}
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
