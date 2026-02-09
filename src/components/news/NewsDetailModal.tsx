import styled from "styled-components";
import { type HomeNews } from "../../data/mock/homeNews";

/**
 * 📰 뉴스 상세 모달
 * - 뉴스 읽으면 출석 처리
 * - 퀴즈는 선택 사항
 * - 나중에 페이지로 쉽게 분리 가능
 */

const NewsDetailModal = ({
  news,
  onClose,
  onRead,
  onGoQuiz,
}: {
  news: HomeNews;
  onClose: () => void;
  onRead: () => void; // ✅ 출석 처리
  onGoQuiz: () => void; // 🧠 퀴즈로 이동
}) => {
  return (
    <Overlay>
      <Modal>
        <Title>{news.title}</Title>

        <Content>{news.summary}</Content>

        {/* 💡 퀴즈 안내 문구 */}
        <HintText>퀴즈를 풀면 🪙 코인을 받을 수 있어요!</HintText>

        <ButtonGroup>
          <CancelButton onClick={onClose}>나중에 할래요</CancelButton>

          <ConfirmButton
            onClick={() => {
              onRead(); // ✅ 뉴스 읽음 → 출석
              onGoQuiz(); // 🧠 퀴즈 이동
            }}
          >
            퀴즈 풀러 가기
          </ConfirmButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 300px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h3`
  font-size: 17px;
  font-weight: 900;
  margin: 0;
`;

const Content = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HintText = styled.div`
  font-size: 13px;
  background: ${({ theme }) => theme.colors.card};
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 6px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.border};
  font-weight: 700;

  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: black;
  }
`;

export default NewsDetailModal;
