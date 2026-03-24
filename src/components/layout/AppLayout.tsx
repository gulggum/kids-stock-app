import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import HeaderNav from "../navigation/HeaderNav";
import BottomNav from "../navigation/BottomNav";
import ModalPopup from "../ModalPopup";
import { useModal } from "../../context/UIContext/ModalContext";
import { useAchievement } from "../../context/AchievementContext/AchievementContext";
import { ACHIEVEMENTS } from "../../data/rules/achievementRules";
import bgImage from "../../assets/images/bgImage.png";

const AppLayout = () => {
  const { popupAchievement, closePopupAchievement } = useAchievement();
  const achievementMeta = popupAchievement
    ? ACHIEVEMENTS.find((a) => a.id === popupAchievement)
    : null;
  const { modal, closeModal } = useModal();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <Layout $variant={isHome ? "home" : "default"}>
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
const Layout = styled.div<{ $variant?: "home" | "default" }>`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  min-height: 100dvh;

  max-width: 600px; // 아이패드 느낌
  margin: 0 auto; // 가운데 정렬
  width: 100%;

  background-image: ${({ $variant }) =>
    $variant === "home"
      ? `url(${bgImage})` // 귀여운 홈
      : `url(${bgImage})`}; // 기본

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-x: hidden;
`;

const Main = styled.main`
  padding: 16px;
  padding-bottom: 90px;
  overflow-x: hidden;
  width: 100%;
  height: 100vh;
`;

const Footer = styled.footer`
  padding: 12px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

export default AppLayout;
