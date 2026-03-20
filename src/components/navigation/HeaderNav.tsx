import styled from "styled-components";
import ThemeToggleButton from "../ThemeToggleButton";
import { NavLink } from "react-router-dom";
import {
  Home,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";

// 🖥 PC용
const HeaderNav = () => {
  return (
    <HeaderWrapper>
      <Logo to="/"> KidsStock</Logo>

      <Nav>
        <NavItem to="/">
          <Home size={16} />홈
        </NavItem>

        <NavItem to="/market">
          <TrendingUp size={16} />
          마켓
        </NavItem>

        <NavItem to="/portfolio">
          <Wallet size={16} />
          자산
        </NavItem>

        <NavItem to="/character">
          <User size={16} />
          캐릭터
        </NavItem>

        <NavItem to="/community">
          <MessageCircle size={16} />
          커뮤니티
        </NavItem>

        <NavItem to="/shop">
          <ShoppingBag size={16} />
          상점
        </NavItem>
      </Nav>

      <RightBox>
        <ThemeToggleButton />
      </RightBox>
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

  padding: 12px 20px;

  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled(NavLink)`
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.md};

  font-size: 14px;
  font-weight: 600;

  color: ${({ theme }) => theme.colors.muted};

  transition: all 0.2s ease;

  svg {
    stroke: ${({ theme }) => theme.colors.muted};
    transition: all 0.2s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.text};

    svg {
      stroke: ${({ theme }) => theme.colors.text};
    }
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;

    svg {
      stroke: white;
    }
  }
`;

const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default HeaderNav;
