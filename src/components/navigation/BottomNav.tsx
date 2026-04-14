// 📱 모바일용 (하단 네비)
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Wallet,
  MessageCircle,
  User,
  ShoppingBag,
} from "lucide-react";

const BottomNav = () => {
  return (
    <BottomWrapper>
      <Nav>
        <Item to="/" end>
          <IconBox>
            <Home size={20} />
          </IconBox>
          홈
        </Item>

        <Item to="/market">
          <IconBox>
            <TrendingUp size={20} />
          </IconBox>
          마켓
        </Item>

        <Item to="/portfolio">
          <IconBox>
            <Wallet size={20} />
          </IconBox>
          자산
        </Item>

        <Item to="/community">
          <IconBox>
            <MessageCircle size={20} />
          </IconBox>
          커뮤니티
        </Item>

        <Item to="/character">
          <IconBox>
            <User size={20} />
          </IconBox>
          캐릭터
        </Item>

        <Item to="/shop">
          <IconBox>
            <ShoppingBag size={20} />
          </IconBox>
          상점
        </Item>
      </Nav>
    </BottomWrapper>
  );
};

const BottomWrapper = styled.header`
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
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  border-top: 1px solid rgba(0, 0, 0, 0.05);

  padding-bottom: calc(env(safe-area-inset-bottom) + 6px);

  /* 🔥 iOS 버그 해결 스크롤바내릴시 하단메뉴바 찌그러지는 현상대처?*/
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
`;

const Item = styled(NavLink)`
  flex: 1;
  height: 100%;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};

  &:hover {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 12px;

    svg {
      transform: scale(1.05);
    }
  }
  &.active {
    color: ${({ theme }) => theme.colors.primary};

    background: rgba(255, 255, 255, 0.85);
    border-radius: 14px;

    padding: 6px 8px;

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    svg {
      stroke: ${({ theme }) => theme.colors.primary};
      stroke-width: 2.4;
      transform: scale(1.1);
    }
  }
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default BottomNav;
