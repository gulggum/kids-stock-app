import styled from "styled-components";
import ThemeToggleButton from "../ThemeToggleButton";
import { NavLink } from "react-router-dom";

// 🖥 PC용
const HeaderNav = () => {
  return (
    <HeaderWrapper>
      <strong>StockKids</strong>
      <Nav>
        <NavItem to="/">홈</NavItem>
        <NavItem to="/market">마켓</NavItem>
        <NavItem to="/portfolio">내 자산</NavItem>
        <NavItem to="/character">캐릭터</NavItem>
        <NavItem to="/community">커뮤니티</NavItem>
        <NavItem to="/shop">상점</NavItem>
      </Nav>
      <ThemeToggleButton />
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;

  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 768px) {
    display: none; //모바일에선 숨김
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 12px;
`;

const NavItem = styled(NavLink)`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

export default HeaderNav;
