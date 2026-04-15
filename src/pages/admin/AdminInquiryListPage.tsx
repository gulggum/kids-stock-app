import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useInquiry, type InquiryWithProfile } from "../../hooks/useInquiry";
import { useEffect, useState } from "react";
import { getDateKey } from "../../utils/date";
import { ChevronLeft } from "lucide-react";

const statusMap = {
  pending: { label: "접수됨", color: "#F59E0B" },
  checking: { label: "확인중", color: "#3B82F6" },
  done: { label: "답변완료", color: "#22C55E" },
};

export default function AdminInquiryListPage() {
  const navigate = useNavigate();
  const { getAllInquiries } = useInquiry();

  const [inquiryList, setInquiryList] = useState<InquiryWithProfile[]>([]);

  useEffect(() => {
    const fetchInquires = async () => {
      const { inquiries } = await getAllInquiries();
      setInquiryList(inquiries);
    };

    fetchInquires();
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <Title>문의 관리</Title>
        <Count>{inquiryList.length}건</Count>
      </Header>

      <List>
        {inquiryList.map((item) => {
          const status = statusMap[item.status as keyof typeof statusMap];

          return (
            <Card
              key={item.id}
              onClick={() => navigate(`/admin/inquiries/${item.id}`)}
            >
              <TopRow>
                <Nickname>{item.profiles?.nickname ?? "알수 없음"}</Nickname>
                <StatusBadge $color={status.color}>{status.label}</StatusBadge>
              </TopRow>

              <InquiryTitle>{item.title}</InquiryTitle>

              <BottomRow>
                <DateText>{getDateKey(new Date(item.created_at))}</DateText>
                <Arrow>→</Arrow>
              </BottomRow>
            </Card>
          );
        })}
      </List>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Count = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.button`
  width: 100%;
  border: none;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  text-align: left;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:hover {
    transform: translateY(-1px);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Nickname = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const InquiryTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const DateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Arrow = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const StatusBadge = styled.div<{ $color: string }>`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}18`};
`;
const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.card};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
