import styled from "styled-components";
import { useAttendance } from "../context/AttendanceContext";
import { missedNews, todayNews, type HomeNews } from "../data/homeNews";
import AttendanceCalendar from "../components/AttendanceCalendar";
import { useMission } from "../context/MissionContext";
import { newsQuizzes, type NewsQuiz } from "../data/newsQuiz";
import { useCoin } from "../context/Coin&Money/CoinContext";
import { useState } from "react";
import NewsQuizModal from "../components/news/NewsQuizModal";
import NewsDetailModal from "../components/news/NewsDetailModal";
import { useModal } from "../context/ModalContext";

/**
 * 🏠 홈 화면
 * - 뉴스 확인
 * - 출석 체크
 * - 오늘 할 일 안내
 * 
 * 코인: 아이템 구매용, 머니: 주식 투자용, 점수: 활동 성실도 표시용

 */

const Home = () => {
  const { checkToday, streak } = useAttendance();
  const { score, addScore } = useMission();
  const { addCoin } = useCoin();
  const { openModal } = useModal();
  const [activeNews, setActiveNews] = useState<HomeNews | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<NewsQuiz | null>(null);
  const handleNewsClick = (news: HomeNews) => {
    setActiveNews(news);
  };

  const handleReadNews = () => {
    checkToday(); // ✅ 뉴스 1개라도 읽으면 출석
  };

  const handleGoQuiz = (news: HomeNews) => {
    const quiz = newsQuizzes.find((q) => q.newsId === news.id);
    if (quiz) {
      setActiveQuiz(quiz);
    }
  };
  const handleQuizCorrect = () => {
    //퀴즈맞추면 보상지급
    addCoin(1);
    addScore(2);
    //정답 결과 팝업
    openModal({
      type: "INFO",
      title: "🎉 오~ 맞췄어!",
      message: "좀 더 스마트해진 느낌?!\n코인 +1 🪙",
      confirmText: "확인",
    });
  };

  return (
    <Wrapper>
      <Section>
        <SectionTitle>🏆 이번 주 활동 점수</SectionTitle>
        <AttendanceBox>{score} 점</AttendanceBox>
      </Section>
      {/* 📰 오늘의 뉴스 */}
      <Section>
        <SectionTitle>📰 오늘의 뉴스</SectionTitle>
        <Card onClick={() => handleNewsClick(todayNews)}>
          <strong>{todayNews.title}</strong>
          <p>{todayNews.summary}</p>
        </Card>
      </Section>

      {/* 🌙 놓친 뉴스 */}
      <Section>
        <SectionTitle>🌙 자면서 놓친 뉴스</SectionTitle>
        {missedNews.map((news) => (
          <Card key={news.id} onClick={() => handleNewsClick(todayNews)}>
            <strong>{news.title}</strong>
            <p>{news.summary}</p>
          </Card>
        ))}
      </Section>

      {/* 📅 출석 상태 */}
      <Section>
        <SectionTitle>📅 오늘의 출석</SectionTitle>
        <AttendanceBox>
          {" "}
          <span>오늘의 출석</span>
          <StreakText>
            🔥 <StreakNumber>{streak}</StreakNumber>일 연속
          </StreakText>
        </AttendanceBox>
        <AttendanceCalendar />
      </Section>
      {/* 📰 뉴스 상세 모달 */}
      {/* 🧠 퀴즈 모달 */}
      {activeNews && (
        <NewsDetailModal
          news={activeNews}
          onClose={() => setActiveNews(null)}
          onRead={handleReadNews}
          onGoQuiz={() => {
            setActiveNews(null);
            handleGoQuiz(activeNews);
          }}
        />
      )}

      {activeQuiz && (
        <NewsQuizModal
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onCorrect={handleQuizCorrect}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* 모달 떠 있을 때 배경 스크롤 방지용(선택) */
  position: relative;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;

  p {
    margin-top: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;
const AttendanceBox = styled.div`
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.lg};

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.card},
    ${({ theme }) => theme.colors.surface}
  );

  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 14px;
  font-weight: 700;
`;

const StreakText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;
const StreakNumber = styled.strong`
  font-size: 18px;
  font-weight: 900;
`;
export default Home;
