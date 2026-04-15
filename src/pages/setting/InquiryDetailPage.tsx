import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Clock3, Search, CheckCircle2 } from "lucide-react";
import { useInquiry } from "../../hooks/useInquiry";
import type { Inquiry } from "../../types/UserType";
import { useEffect, useState } from "react";
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

export default function InquiryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getInquiryById } = useInquiry();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);

  const currentStatus = inquiry?.status || "pending";
  const status = statusMap[currentStatus];

  useEffect(() => {
    const fetchInquiry = async () => {
      if (!id) return;

      const { inquiry } = await getInquiryById(id);
      setInquiry(inquiry);
    };

    fetchInquiry();
  }, [id]);

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderTitle>문의 상세</HeaderTitle>
        <div style={{ width: 36 }} />
      </Header>

      <StatusCard>
        <StatusBadge $color={status.color}>
          {status.icon}
          {status.label}
        </StatusBadge>
        <StatusDate> {getDateKey(new Date(inquiry?.created_at!))}</StatusDate>
      </StatusCard>

      <SectionCard>
        <Category>{inquiry?.category}</Category>
        <Title>{inquiry?.title}</Title>
        <Content>{inquiry?.content}</Content>
      </SectionCard>

      <AnswerCard>
        <AnswerTitle>관리자 답변</AnswerTitle>

        {inquiry?.answer ? (
          <>
            <AnswerText>{inquiry?.answer}</AnswerText>
            <AnswerDate>
              {getDateKey(new Date(inquiry.answered_at!))} 답변 완료
            </AnswerDate>
          </>
        ) : (
          <EmptyText>
            아직 답변이 등록되지 않았어요.
            <br />
            조금만 기다려주세요 💌
          </EmptyText>
        )}
      </AnswerCard>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const StatusCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.sm};
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

const StatusDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Category = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Content = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: pre-wrap;
`;

const AnswerCard = styled.div`
  background: #eef8ff;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AnswerTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const AnswerText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;

const AnswerDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;
