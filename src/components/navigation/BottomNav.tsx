// 📱 모바일용 (하단 네비)
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <BottomWrapper>
      <Nav>
        <Item to="/" end>
          <Icon>🏠</Icon>홈
        </Item>

        <Item to="/market">
          <Icon>📊</Icon>
          마켓
        </Item>

        <Item to="/portfolio">
          <Icon>💼</Icon>
          자산
        </Item>

        <Item to="/community">
          <Icon>💬</Icon>
          커뮤니티
        </Item>
        <Item to="/character">
          <Icon>👦</Icon>
          캐릭터
        </Item>
        <Item to="/shop">
          <Icon>🛍</Icon>
          상점
        </Item>
      </Nav>
    </BottomWrapper>
  );
};

const BottomWrapper = styled.header`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  @media (min-width: 769px) {
    display: none; // PC에서는 숨김
  }
  z-index: 5;
`;

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-around;
  align-items: center;

  height: 64px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);

  padding-bottom: calc(env(safe-area-inset-bottom) + 6px);

  /* PC에서는 숨김 */
  @media (min-width: 769px) {
    display: none;
  }
`;

const Item = styled(NavLink)`
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// 아이콘
const Icon = styled.span`
  font-size: 20px;
`;

export default BottomNav;
