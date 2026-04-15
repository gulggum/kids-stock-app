import styled from "styled-components";
import { useEffect, useState } from "react";
import type { Inquiry } from "../../types/UserType";
import { useInquiry, type InquiryWithProfile } from "../../hooks/useInquiry";
import { useNavigate, useParams } from "react-router";
import { useModal } from "../../context/UIContext/ModalContext";
import { ChevronLeft } from "lucide-react";

export default function AdminInquiryDetailPage() {
  const { id } = useParams();
  const { getInquiryById, updateInquiry } = useInquiry();
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Inquiry["status"]>("checking");
  const [answer, setAnswer] = useState("");
  const [inquiry, setInquiry] = useState<InquiryWithProfile | null>(null);

  useEffect(() => {
    const fetchInquiry = async () => {
      if (!id) return;

      const { inquiry } = await getInquiryById(id);

      if (!inquiry) return;

      setInquiry(inquiry);
      setStatus(inquiry.status);
      setAnswer(inquiry.answer ?? "");
    };

    fetchInquiry();
  }, [id]);

  const handleSave = () => {
    openModal({
      type: "CONFIRM",
      title: "답변 저장",
      message: "문의 답변과 상태를 저장할까요?",
      confirmText: "저장",
      cancelText: "취소",
      onConfirm: async () => {
        closeModal();

        if (!id) return;

        const { error } = await updateInquiry(id, status, answer);

        if (error) {
          openModal({
            type: "INFO",
            title: "저장 실패",
            message: "문의 저장 중 문제가 발생했어요",
            confirmText: "확인",
            onConfirm: closeModal,
          });
          return;
        }

        openModal({
          type: "INFO",
          title: "저장 완료",
          message: "문의 상태와 답변이 저장되었어요",
          confirmText: "확인",
          onConfirm: closeModal,
        });
      },
      onCancel: closeModal,
    });
  };

  return (
    <Container>
      <TopWrap>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <Title>문의 답변</Title>
        <div style={{ width: "50px" }}></div>
      </TopWrap>

      <Card>
        <Label>유저</Label>
        <Value>{inquiry?.profiles?.nickname}</Value>

        <Label>문의 유형</Label>
        <Value>{inquiry?.category}</Value>

        <Label>제목</Label>
        <Value>{inquiry?.title}</Value>

        <Label>문의 내용</Label>
        <Content>{inquiry?.content}</Content>
      </Card>

      <Card>
        <Label>상태 변경</Label>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as Inquiry["status"])}
        >
          <option value="pending">접수됨</option>
          <option value="checking">확인중</option>
          <option value="done">답변완료</option>
        </Select>

        <Label>답변 작성</Label>
        <Textarea
          placeholder="유저에게 보여질 답변을 입력해주세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <SaveButton type="button" onClick={handleSave}>
          저장하기
        </SaveButton>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopWrap = styled.div`
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

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
`;

const Label = styled.p`
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const Value = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Content = styled.div`
  margin-bottom: 4px;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  margin-bottom: 16px;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  resize: none;
  margin-bottom: 16px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SaveButton = styled.button`
  width: 100%;
  border: none;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
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
  margin-right: 15px;
`;
