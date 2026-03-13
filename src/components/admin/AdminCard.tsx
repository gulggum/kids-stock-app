import styled from "styled-components";

/**
 * 관리자 대시보드 카드 컴포넌트
 */

interface Props {
  title: string;
  value: string;
}

const AdminCard = ({ title, value }: Props) => {
  return (
    <Card>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </Card>
  );
};
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: ${({ theme }) => theme.shadows.sm};

  transition: 0.15s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Title = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 6px;
`;

const Value = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export default AdminCard;
