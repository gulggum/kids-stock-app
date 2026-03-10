import styled from "styled-components";
import { type HomeNews } from "../../data/mock/homeNews";
import { useQuizProgress } from "../../context/QuizContext/QuizProgressContext";

type Props = {
  news: HomeNews[];
  onClick: (news: HomeNews) => void;
};

const NewsSection = ({ news, onClick }: Props) => {
  const { isSolved } = useQuizProgress();

  return (
    <Section>
      {news.length === 0 && (
        <LoadingText>새로운 경제 뉴스가 준비되고 있어요 📚</LoadingText>
      )}

      {news.map((item) => (
        <Card key={item.id} onClick={() => onClick(item)}>
          <CardTop>
            <TitleRow>
              <NewsIcon>📰</NewsIcon>
              <Title>{item.title}</Title>
            </TitleRow>

            {!isSolved(item.id) && <Reward>+10 EXP</Reward>}
            {isSolved(item.id) && (
              <CompletedStamp>
                퀴즈
                <br />
                완료
              </CompletedStamp>
            )}
          </CardTop>

          <Summary>{item.summary}</Summary>

          {!isSolved(item.id) && <QuizHint>🧠 퀴즈 도전하기</QuizHint>}
        </Card>
      ))}
    </Section>
  );
};

export default NewsSection;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 20px;
  font-size: 14px;
`;

const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;

  p {
    margin-top: 6px;
    font-size: 14px;
  }
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-3px);
  }
  animation: cardIn 0.3s ease;
  @keyframes cardIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const NewsIcon = styled.span`
  width: 28px;
  height: 28px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fde68a;
  font-size: 14px;
`;
const Title = styled.strong`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const Reward = styled.div`
  position: absolute;
  top: 10px;
  right: 12px;

  background: white;
  color: #2563eb;

  font-size: 11px;
  font-weight: 800;

  padding: 4px 10px;
  border-radius: 6px;

  transform: rotate(-7deg);

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);

    width: 28px;
    height: 10px;

    background: #bff0c6;
    backdrop-filter: blur(2px);

    border-radius: 2px;
  }
`;

const Summary = styled.p`
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.4;
`;

const CompletedStamp = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;

  width: 56px;
  height: 56px;

  border-radius: 50%;
  border: 3px solid #16a34a;

  color: #16a34a;
  font-size: 13px;
  font-weight: 900;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: rotate(-12deg);

  background: rgba(255, 255, 255, 0.5);

  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(22, 163, 74, 0.3);

  color: rgba(22, 163, 74, 0.9);
  animation: stamp 0.25s ease;

  @keyframes stamp {
    0% {
      transform: scale(1.6) rotate(-12deg);
      opacity: 0;
    }
    100% {
      transform: scale(1) rotate(-12deg);
      opacity: 1;
    }
  }
`;

const QuizHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.7;
`;
