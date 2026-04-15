import styled from "styled-components";
import { NavLink } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * 관리자 메뉴 Sidebar
 *
 * PC
 *  - 고정 사이드바
 *
 * 모바일
 *  - 슬라이드 메뉴
 */

const AdminSidebar = ({ open, setOpen }: Props) => {
  return (
    <Sidebar $open={open}>
      <Title as={NavLink} to="/admin">
        KIDSSTOCK
      </Title>

      <Menu>
        {/* end prop: 정확히 이 경로일 때만 active */}
        <MenuItem to="/admin" end onClick={() => setOpen(false)}>
          대시보드
        </MenuItem>

        <MenuItem to="/admin/news" onClick={() => setOpen(false)}>
          뉴스 생성
        </MenuItem>

        <MenuItem to="/admin/ranking" onClick={() => setOpen(false)}>
          랭킹
        </MenuItem>

        <MenuItem to="/admin/items" onClick={() => setOpen(false)}>
          아이템
        </MenuItem>

        <MenuItem to="/admin/stats" onClick={() => setOpen(false)}>
          통계
        </MenuItem>
        <MenuItem to="/admin/inquiries" onClick={() => setOpen(false)}>
          문의 관리
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
const Sidebar = styled.aside<{ $open: boolean }>`
  width: 240px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 28px 20px;

  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    position: fixed;
    left: ${({ $open }) => ($open ? "0" : "-280px")};
    top: 0;
    height: 100%;
    z-index: 1000;
    transition: 0.25s ease;
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.text};
`;

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MenuItem = styled(NavLink)`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 600;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

export default AdminSidebar;
