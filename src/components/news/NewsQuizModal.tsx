import styled from "styled-components";
import { type NewsQuiz } from "../../data/mock/newsQuiz";
import { useState } from "react";

/**
 * 🧠 뉴스 퀴즈 모달
 * - 퀴즈를 풀어야 코인 획득
 * - 닫기 가능 (강요 ❌)
 */

const NewsQuizModal = ({
  quiz,
  onClose,
  onCorrect,
}: {
  quiz: NewsQuiz;
  onClose: () => void;
  onCorrect: () => void;
}) => {
  //어떤 보기를 눌렀는지 기억
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // 정답을 맞췄는지 여부 (확인 버튼 노출용)
  const [isWrong, setIsWrong] = useState(false);

  const handleOptionClick = (index: number) => {
    setSelectedIndex(index);

    // ✅ 정답일 경우
    if (index === quiz.answerIndex) {
      onCorrect(); // 👉 부모에서 결과 팝업 + 보상
      onClose(); // 👉 퀴즈 모달 닫기
      return;
    }

    // ❌ 오답
    setIsWrong(true);
  };

  return (
    <Overlay>
      <Modal>
        <Title>🧠 퀴즈!</Title>
        <Question>{quiz.question}</Question>
        <HintText>
          {" "}
          정답을 맞히면 <strong>🪙 코인</strong>을 받을 수 있어요!
        </HintText>
        <Options>
          {quiz.options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            const isCorrect = i === quiz.answerIndex;

            return (
              <OptionButton
                key={i}
                onClick={() => handleOptionClick(i)}
                $correct={isSelected && isCorrect}
                $wrong={isSelected && !isCorrect}
              >
                {opt}
              </OptionButton>
            );
          })}

          {/* ❌ 오답 안내 */}
          {isWrong && <WrongText>다시 생각해봐요 🤔</WrongText>}
        </Options>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
`;

const Modal = styled.div`
  width: 280px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};

  display: flex;
  flex-direction: column;
  gap: 14px;

  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 900;
  text-align: center;
  margin: 0;
`;

const Question = styled.p`
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionButton = styled.button<{
  $correct: boolean;
  $wrong: boolean;
}>`
  width: 100%;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  transition: all 0.2s ease;

  ${({ $correct, theme }) =>
    $correct &&
    `
      background: ${theme.colors.up};
      color: white;
    `}

  ${({ $wrong, theme }) =>
    $wrong &&
    `
      background: ${theme.colors.down};
      color: white;
    `}
`;

const HintText = styled.div`
  font-size: 13px;
  text-align: center;
  line-height: 1.4;

  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.md};

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.card},
    ${({ theme }) => theme.colors.surface}
  );

  box-shadow: ${({ theme }) => theme.shadows.sm};

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 800;
  }
`;
const WrongText = styled.div`
  margin-top: 12px;
  text-align: center;

  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.down};

  animation: shake 0.3s ease;

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-3px);
    }
    50% {
      transform: translateX(3px);
    }
    75% {
      transform: translateX(-3px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

export default NewsQuizModal;
