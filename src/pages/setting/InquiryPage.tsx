import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Send,
  MessageCircle,
  Bug,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { useInquiry } from "../../hooks/useInquiry";
import { useUser } from "../../context/UserContext";
import { useModal } from "../../context/UIContext/ModalContext";

const categories = [
  {
    label: "버그 제보",
    icon: <Bug size={16} />,
    color: "#EF4444",
  },
  {
    label: "계정 문의",
    icon: <ShieldAlert size={16} />,
    color: "#8B5CF6",
  },
  {
    label: "의견 / 제안",
    icon: <Lightbulb size={16} />,
    color: "#F59E0B",
  },
  {
    label: "기타",
    icon: <MessageCircle size={16} />,
    color: "#2E8EDB",
  },
];

export default function InquiryPage() {
  const navigate = useNavigate();
  const { createInquiry } = useInquiry();
  const { user } = useUser();
  const { openModal, closeModal } = useModal();

  const [selectedCategory, setSelectedCategory] = useState("버그 제보");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isDisabled = !title.trim() || !content.trim();

  const handleOpenSubmitModal = () => {
    openModal({
      type: "CONFIRM",
      title: "문의 보내기",
      message: "작성한 문의를 보낼까요?",
      confirmText: "보내기",
      cancelText: "취소",
      onConfirm: async () => {
        closeModal();

        const { error } = await createInquiry(
          user.id,
          title,
          content,
          selectedCategory,
        );

        if (error) {
          openModal({
            type: "CONFIRM",
            title: "문의 등록 실패",
            message: "문의 등록 중 문제가 발생했어요",
            confirmText: "확인",
            onConfirm: closeModal,
          });
          return;
        }

        openModal({
          type: "CONFIRM",
          title: "문의 등록 완료",
          message: "문의가 등록되었어요 💌",
          confirmText: "확인",
          onConfirm: () => {
            closeModal();
            navigate("/inquiry/history");
          },
        });
      },
      onCancel: closeModal,
    });
  };

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderTitle>문의하기</HeaderTitle>
        <div style={{ width: 36 }} />
      </Header>

      <InfoCard>
        <InfoTitle>무엇을 도와드릴까요?</InfoTitle>
        <InfoText>
          궁금한 점이나 불편한 점을 남겨주시면
          <br />
          최대한 빠르게 확인해서 답변드릴게요 💌
        </InfoText>
      </InfoCard>
      <HistoryButton type="button" onClick={() => navigate("/inquiry/history")}>
        내 문의내역 보기
      </HistoryButton>
      <Section>
        <SectionTitle>문의 유형</SectionTitle>
        <CategoryGrid>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.label;

            return (
              <CategoryButton
                key={category.label}
                type="button"
                onClick={() => setSelectedCategory(category.label)}
                $selected={isSelected}
                $color={category.color}
              >
                <CategoryIcon $color={category.color}>
                  {category.icon}
                </CategoryIcon>
                <CategoryLabel>{category.label}</CategoryLabel>
              </CategoryButton>
            );
          })}
        </CategoryGrid>
      </Section>

      <Section>
        <SectionTitle>제목</SectionTitle>
        <Input
          placeholder="문의 제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
        />
      </Section>

      <Section>
        <SectionTitle>문의 내용</SectionTitle>
        <Textarea
          placeholder="궁금한 점이나 불편했던 점을 자세히 적어주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
        <LengthText>{content.length} / 500</LengthText>
      </Section>

      <SubmitButton onClick={handleOpenSubmitModal} disabled={isDisabled}>
        <Send size={16} />
        문의 보내기
      </SubmitButton>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
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
  color: ${({ theme }) => theme.colors.text};
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #e8f4ff 0%, #f7fbff 100%);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InfoTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.p`
  margin: 0 4px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const CategoryButton = styled.button<{ $selected: boolean; $color: string }>`
  border: 1.5px solid
    ${({ $selected, $color, theme }) =>
      $selected ? $color : theme.colors.border};
  background: ${({ $selected, $color }) =>
    $selected ? `${$color}15` : "white"};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CategoryIcon = styled.div<{ $color: string }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ $color }) => `${$color}18`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LengthText = styled.p`
  margin: 0;
  text-align: right;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const SubmitButton = styled.button`
  margin-top: auto;
  width: 100%;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 15px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const HistoryButton = styled.button`
  width: 100%;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px;
  background: white;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
