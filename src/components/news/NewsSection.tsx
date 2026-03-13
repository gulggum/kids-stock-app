import styled from "styled-components";
import { type HomeNews } from "../../data/mock/homeNewsMockData";
import { useQuizProgress } from "../../context/QuizContext/QuizProgressContext";
import { marketMockData } from "../../data/mock/marketMock";
import { useNavigate } from "react-router-dom";

type Props = {
  news: HomeNews[];
  onClick: (news: HomeNews) => void;
};

const NewsSection = ({ news, onClick }: Props) => {
  const navigate = useNavigate();
  const { isSolved } = useQuizProgress();

  return (
    <Section>
      {news.length === 0 && (
        <LoadingText>새로운 경제 뉴스가 준비되고 있어요 📚</LoadingText>
      )}

      {news.map((item) => {
        const companies = marketMockData.filter((s) =>
          item.stockIds?.includes(s.id),
        );

        return (
          <Card
            key={item.id}
            onClick={() => onClick(item)}
            $completed={isSolved(item.id)}
          >
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
            <BottomRow>
              <LeftArea>
                {!isSolved(item.id) && <QuizHint>🧠 퀴즈 도전하기</QuizHint>}
              </LeftArea>

              <RightArea>
                {companies.length > 0 && (
                  <CompanyGuide>관련기업 구경가기 {""}</CompanyGuide>
                )}

                <CompanyTags>
                  {companies.map((company) => (
                    <CompanyTagLink
                      key={company.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/market/${company.id}`);
                      }}
                    >
                      #{company.name}
                    </CompanyTagLink>
                  ))}
                </CompanyTags>
              </RightArea>
            </BottomRow>
          </Card>
        );
      })}
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

const Card = styled.div<{ $completed?: boolean }>`
  position: relative;

  background: ${({ $completed }) =>
    $completed ? "linear-gradient(180deg, #f5f1dc, #efe8c8)" : "#ffffff"};

  padding: 14px;

  border-radius: ${({ $completed }) =>
    $completed ? "18px 14px 20px 12px" : "16px"};

  box-shadow: ${({ $completed }) =>
    $completed
      ? "0 2px 4px rgba(0,0,0,0.08), inset 0 0 6px rgba(0,0,0,0.05)"
      : "0 2px 6px rgba(0,0,0,0.1)"};

  cursor: pointer;

  /* 읽은 카드 바랜 느낌 */
  filter: ${({ $completed }) =>
    $completed ? "saturate(0.7) brightness(0.96)" : "none"};

  /* 애니메이션 */
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-3px);
  }

  /* 카드 등장 애니메이션 */
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

  p {
    margin-top: 6px;
    font-size: 14px;
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
  margin-bottom: 8px;
`;

const NewsIcon = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fde68a;
  font-size: 14px;
  margin-right: 8px;
`;
const Title = styled.strong`
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄 */
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 14px;
  line-height: 1.3;

  word-break: keep-all;
`;

const Reward = styled.div`
  position: absolute;
  top: 20px;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
`;

const CompletedStamp = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  width: 90px;
  height: 90px;

  border-radius: 50%;
  border: 3px solid #16a34a;

  color: #16a34a;
  font-size: 18px;
  font-weight: 900;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.5);
  pointer-events: none; /* 클릭 막지 않게 */
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(22, 163, 74, 0.3);

  color: rgba(22, 163, 74, 0.9);
  transform: translate(-50%, -50%) rotate(-12deg);

  animation: stamp 0.25s ease;

  @keyframes stamp {
    0% {
      transform: translate(-50%, -50%) scale(1.6) rotate(-12deg);
      opacity: 0;
    }

    100% {
      transform: translate(-50%, -50%) scale(1) rotate(-12deg);
      opacity: 1;
    }
  }
`;

const QuizHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.7;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const LeftArea = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

//관련기업태그
const RightArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const CompanyGuide = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: 10px;
`;

const CompanyTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const CompanyTagLink = styled.button`
  border: none;
  background: none;

  font-size: 12px;
  font-weight: 700;

  color: ${({ theme }) => theme.colors.primary};

  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 4px;

  transition: transform 0.15s ease;

  &:hover {
    transform: translateX(2px);
    text-decoration: underline;
  }
`;
