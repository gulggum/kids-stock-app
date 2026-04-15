import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Inquiry } from "../../types/UserType";
import { useUser } from "../../context/UserContext";
import { useInquiry } from "../../hooks/useInquiry";
import { getDateKey } from "../../utils/date";

const statusMap = {
  pending: {
    label: "접수됨",
    color: "#F59E0B",
    icon: <Clock3 size={14} />,
  },
  checking: {
    label: "확인중",
    color: "#3B82F6",
    icon: <Search size={14} />,
  },
  done: {
    label: "답변완료",
    color: "#22C55E",
    icon: <CheckCircle2 size={14} />,
  },
};

export default function InquiryHistoryPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getMyInquiries } = useInquiry();
  const [inquiryList, setInquiryList] = useState<Inquiry[]>([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user.id) return;

      const { inquiries } = await getMyInquiries(user.id);
      setInquiryList(inquiries);
    };

    fetchInquiries();
  }, [user.id]);

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderTitle>내 문의내역</HeaderTitle>
        <div style={{ width: 36 }} />
      </Header>

      <ListWrapper>
        {inquiryList.map((item) => {
          const status = statusMap[item.status as keyof typeof statusMap];

          return (
            <InquiryCard
              key={item.id}
              onClick={() => navigate(`/inquiry/history/${item.id}`)}
            >
              <TopRow>
                <Category>{item.category}</Category>
                <StatusBadge $color={status.color}>
                  {status.icon}
                  {status.label}
                </StatusBadge>
              </TopRow>

              <Title>{item.title}</Title>

              <BottomRow>
                <DateText>{getDateKey(new Date(item.created_at))}</DateText>
                <ChevronRight size={16} color="#bbb" />
              </BottomRow>
            </InquiryCard>
          );
        })}
      </ListWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InquiryCard = styled.button`
  width: 100%;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.card};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: left;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Category = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;
`;

const StatusBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}18`};
`;

const Title = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;
