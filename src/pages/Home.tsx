import styled from "styled-components";
import { useAttendance } from "../context/AttendanceContext";
import { missedNews, todayNews, type HomeNews } from "../data/mock/homeNews";
import AttendanceCalendar from "../components/AttendanceCalendar";
import { useScore } from "../context/ScoreContext";
import { newsQuizzes, type NewsQuiz } from "../data/mock/newsQuiz";
import { useState } from "react";
import NewsQuizModal from "../components/news/NewsQuizModal";
import NewsDetailModal from "../components/news/NewsDetailModal";
import { useModal } from "../context/UIContext/ModalContext";
import { playCoinSound } from "../utils/sounds";
import { useQuizProgress } from "../context/QuizContext/QuizProgressContext";

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
  const { score } = useScore();
  const { openModal } = useModal();
  const { isSolved, markSolved } = useQuizProgress();
  const [activeNews, setActiveNews] = useState<HomeNews | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<NewsQuiz | null>(null);
  const handleNewsClick = (news: HomeNews) => {
    setActiveNews(news);
  };

  const handleReadNews = () => {
    checkToday(); // ✅ 뉴스 1개라도 읽으면 출석
  };

  const handleGoQuiz = (news: HomeNews) => {
    const quiz = newsQuizzes.find((q) => q.newsId === news.id); //이 뉴스와 일치하는 id의 퀴즈 가져오기
    console.log(quiz);
    if (!quiz) {
      openModal({
        type: "INFO",
        title: "퀴즈 준비 중!",
        message: "이 뉴스에는 아직 퀴즈가 없어요 🙂",
        confirmText: "확인",
      });
      return;
    }

    //중복 보상 차단
    if (isSolved(quiz.newsId)) {
      openModal({
        type: "INFO",
        title: "앗 이미 풀었어!",
        message: "다른 뉴스 봐볼까~? ",
        confirmText: "확인",
      });
      return;
    }
    //아직 안 풀었으면 퀴즈 열기
    setActiveQuiz(quiz);
  };
  const handleQuizCorrect = (newsId: string) => {
    //퀴즈 푼 기록
    markSolved(newsId); //기록 + 보상

    //정답 결과 팝업
    openModal({
      type: "INFO",
      title: "🎉 오~ 맞췄어!",
      message: "보상을 획득했어요! 🪙✨",
      confirmText: "확인",
    });
    playCoinSound();
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
          <Card key={news.id} onClick={() => handleNewsClick(news)}>
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
          onCorrect={() => handleQuizCorrect(activeQuiz.newsId)}
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
