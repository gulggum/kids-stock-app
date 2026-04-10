import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import HeaderNav from "../navigation/HeaderNav";
import BottomNav from "../navigation/BottomNav";
import ModalPopup from "../ModalPopup";
import { useModal } from "../../context/UIContext/ModalContext";
import { useAchievement } from "../../context/AchievementContext";
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
            onConfirm={closePopupAchievement}
            customContent={
              <AchievementContent>
                <AchievementLabel>🏅 뱃지 획득!</AchievementLabel>
                <AchievementEmoji>
                  {achievementMeta.badge.emoji}
                </AchievementEmoji>

                <AchievementTitle>
                  {achievementMeta.badge.title}
                </AchievementTitle>
                <AchievementDesc>
                  {achievementMeta.badge.description}
                </AchievementDesc>
              </AchievementContent>
            }
          />
        )}
        <Outlet />
      </Main>
      <BottomNav />
      <Footer>© kidsStock</Footer>
    </Layout>
  );
};

export default AppLayout;

const Layout = styled.div<{ $variant?: "home" | "default" }>`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  min-height: 100dvh;

  width: 100%;

  background-image: ${({ $variant }) =>
    $variant === "home"
      ? `url(${bgImage})` // 귀여운 홈
      : `url(${bgImage})`}; // 기본

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Main = styled.main`
  padding: 16px;
  padding-bottom: 90px;
  width: 100%;
  overflow-x: hidden;
`;

const Footer = styled.footer`
  padding: 12px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

//뱃지
const AchievementContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`;

const AchievementEmoji = styled.div`
  font-size: 48px;
`;

const AchievementLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  padding: 2px 10px;
  border-radius: 999px;
`;

const AchievementTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
`;

const AchievementDesc = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;
