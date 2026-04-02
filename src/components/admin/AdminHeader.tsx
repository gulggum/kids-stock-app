import { Home } from "lucide-react";
import { useNavigate } from "react-router";
import styled from "styled-components";

interface Props {
  setOpen: (value: boolean) => void;
}

/**
 * 관리자 상단 헤더
 *
 * 모바일에서는 햄버거 메뉴 버튼 표시
 * 우측에 홈으로 돌아가기 버튼
 */

const AdminHeader = ({ setOpen }: Props) => {
  const navigate = useNavigate();

  return (
    <Header>
      <LeftRow>
        <MenuButton onClick={() => setOpen(true)}>☰</MenuButton>
        <Title>관리자 페이지</Title>
      </LeftRow>

      <HomeButton onClick={() => navigate("/")}>
        <Home size={16} />
        홈으로
      </HomeButton>
    </Header>
  );
};

export default AdminHeader;

const Header = styled.header`
  height: 64px;
  padding: 0 24px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuButton = styled.button`
  display: none;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 768px) {
    display: block;
  }
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const HomeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;
