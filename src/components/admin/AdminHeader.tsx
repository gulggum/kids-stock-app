import styled from "styled-components";

interface Props {
  setOpen: (value: boolean) => void;
}

/**
 * 관리자 상단 헤더
 *
 * 모바일에서는
 * 햄버거 메뉴 버튼 표시
 */

const AdminHeader = ({ setOpen }: Props) => {
  return (
    <Header>
      <MenuButton onClick={() => setOpen(true)}>☰</MenuButton>

      <Title>관리자 페이지</Title>
    </Header>
  );
};
const Header = styled.header`
  height: 64px;
  padding: 0 24px;

  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  display: none;
  margin-right: 16px;
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
export default AdminHeader;
