import styled from "styled-components";
import { useAttendance } from "../context/AttendanceContext";
import AttendanceCalendar from "../components/AttendanceCalendar";
import { useScore } from "../context/ScoreContext";
import { useMemo, useState } from "react";
import NewsQuizModal from "../components/news/NewsQuizModal";
import NewsDetailModal from "../components/news/NewsDetailModal";
import { useModal } from "../context/UIContext/ModalContext";
import { playCoinSound } from "../utils/sounds";
import { useQuizProgress } from "../context/QuizContext/QuizProgressContext";
import { useNewsQuery } from "../hooks/useNewsQuery";
import NewsSection from "../components/news/NewsSection";
import type { HomeNews, NewsQuiz } from "../data/mock/homeNewsMockData";
import { useCharacter } from "../context/UserContext/CharacterContext";

/**
 * 🏠 홈 화면
 * - 뉴스 확인(useNewsQuery로 실제 데이터 사용)
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
  const { expProgress } = useCharacter();
  const [newsTab, setNewsTab] = useState<"today" | "yesterday">("today"); //뉴스탭
  const [countryTab, setCountryTab] = useState<"KR" | "US">("KR");

  //로컬스토리지의 캐릭터상태 불러오기
  const character = JSON.parse(localStorage.getItem("character_state") || "{}");

  // ✅ 실제 API 데이터 (하루 1번만 호출)
  const { data, isLoading } = useNewsQuery();

  // ✅ 오늘 뉴스
  const todayKRNews = useMemo(
    () =>
      data?.news?.filter((n) => n.type === "today" && n.country === "KR") ?? [],
    [data],
  );
  const todayUSNews = useMemo(
    () =>
      data?.news?.filter((n) => n.type === "today" && n.country === "US") ?? [],
    [data],
  );

  // ✅ 어제 뉴스
  const yesterdayKRNews = useMemo(
    () =>
      data?.news?.filter((n) => n.type === "yesterday" && n.country === "KR") ??
      [],
    [data],
  );
  const yesterdayUSNews = useMemo(
    () =>
      data?.news?.filter((n) => n.type === "yesterday" && n.country === "US") ??
      [],
    [data],
  );

  // ✅ 퀴즈 (API에서 가져옴)
  const quizzes = data?.quizzes ?? [];

  const handleNewsClick = (news: HomeNews) => {
    setActiveNews(news);
  };

  const handleReadNews = () => {
    checkToday(); // ✅ 뉴스 1개라도 읽으면 출석
  };

  const handleGoQuiz = (news: HomeNews) => {
    const quiz = quizzes.find((q) => q.newsId === news.id); //이 뉴스와 일치하는 id의 퀴즈 가져오기

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

  //날짜
  const today = new Date();
  const month = today.getMonth() + 1;

  // 뉴스 읽은 기록 (퀴즈 푼 뉴스)
  const readNewsIds = JSON.parse(localStorage.getItem("quiz_progress") || "[]");
  const currentKRNews = newsTab === "today" ? todayKRNews : yesterdayKRNews;
  const currentUSNews = newsTab === "today" ? todayUSNews : yesterdayUSNews;
  const currentReadCount =
    currentKRNews.filter((n) => readNewsIds.includes(n.id)).length +
    currentUSNews.filter((n) => readNewsIds.includes(n.id)).length;
  const currentNews = countryTab === "KR" ? currentKRNews : currentUSNews;

  return (
    <Wrapper>
      {/* 🏆 나의 경제 활동 */}
      <Section>
        <SectionTitle>🏆 나의 경제 활동</SectionTitle>
        <CharacterBox>
          <LevelRow>
            <Level>🐻 레벨 {character.level}</Level>
            <Exp>EXP {character.exp}</Exp>
          </LevelRow>
          <ExpBar>
            <ExpFill style={{ width: `${expProgress}%` }} />
          </ExpBar>

          <ScoreRow>
            <ScoreNumber>{score}</ScoreNumber>
            <ScoreLabel>오늘 점수</ScoreLabel>
          </ScoreRow>
        </CharacterBox>
      </Section>

      {/* 📰 오늘의 뉴스 */}
      <Section>
        <TitleRow>
          <SectionTitle>
            {newsTab === "today"
              ? "📰 오늘의 경제 이야기"
              : "📚 지난 경제 이야기"}
            <Progress>
              읽은 뉴스 {currentReadCount} /{" "}
              {currentKRNews.length + currentUSNews.length}
            </Progress>
          </SectionTitle>

          {newsTab === "today" && (
            <PastNewsButton onClick={() => setNewsTab("yesterday")}>
              지난 뉴스
            </PastNewsButton>
          )}

          {newsTab === "yesterday" && (
            <PastNewsButton onClick={() => setNewsTab("today")}>
              오늘의 뉴스
            </PastNewsButton>
          )}
        </TitleRow>

        {isLoading && <LoadingText>뉴스 불러오는 중...</LoadingText>}
        {!isLoading && (
          <>
            <CountryTabBar>
              <CountryTab
                $active={countryTab === "KR"}
                onClick={() => setCountryTab("KR")}
              >
                🇰🇷 한국 경제
              </CountryTab>

              <CountryTab
                $active={countryTab === "US"}
                onClick={() => setCountryTab("US")}
              >
                🌎 세계 경제
              </CountryTab>
            </CountryTabBar>

            <NewsSection news={currentNews} onClick={handleNewsClick} />
          </>
        )}
      </Section>

      {/* 📅 출석 상태 */}
      <CalendarSection>
        <SectionTitle>📅 {month}월 출석 </SectionTitle>
        <AttendanceBox>
          {" "}
          <span>오늘의 출석</span>
          <StreakText>
            🔥 <StreakNumber>{streak}</StreakNumber>일 연속
          </StreakText>
        </AttendanceBox>
        <AttendanceCalendar />
      </CalendarSection>

      {/* 📰 뉴스 상세 모달 */}
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
      {/* 🧠 퀴즈 모달 */}
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

const LoadingText = styled.p`
  text-align: center;
  padding: 40px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  gap: 6px;
`;

const SubTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Progress = styled.span`
  font-size: 12px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap; /* 0 / 2 줄바꿈 방지 */
`;
const CalendarSection = styled.section`
  position: relative;

  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};

  background: #fffef6;

  box-shadow: ${({ theme }) => theme.shadows.md};

  border: 2px solid #f1e6b8;

  overflow: hidden;

  /* 📌 달력 철 느낌 */
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    height: 18px;

    background: repeating-linear-gradient(
      90deg,
      #d6d6d6 0px,
      #d6d6d6 12px,
      transparent 12px,
      transparent 28px
    );

    opacity: 0.6;
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

//캐릭터(내상태) 박스
const CharacterBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 18px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LevelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const Level = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentPurple};
`;

const Exp = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;
const ExpBar = styled.div`
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  overflow: hidden;
  margin-top: 6px;
`;

const ExpFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const ScoreNumber = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accentPink};
`;

const ScoreLabel = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

//오늘의 출석
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

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PastNewsButton = styled.button`
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

//탭 바
const CountryTabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`;

const CountryTab = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 18px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};

  color: ${({ $active }) => ($active ? "white" : "#666")};
`;
export default Home;
