import styled, { keyframes, css } from "styled-components";
import { useMemo, useState } from "react";
import NewsQuizModal from "../components/news/NewsQuizModal";
import NewsDetailModal from "../components/news/NewsDetailModal";
import { useModal } from "../context/UIContext/ModalContext";
import { playCoinSound } from "../utils/sounds";
import { useNewsQuery } from "../hooks/useNewsQuery";
import NewsSection from "../components/news/NewsSection";
import type { HomeNews, NewsQuiz } from "../types/newsType";
import { useUser } from "../context/UserContext";
import AttendanceCalendar from "../components/AttendanceCalendar";
import { useReward } from "../context/RewardContext";
import ExpBarCard from "../components/character/ExpBarCard";
import { useKnowledge } from "../hooks/Useknowledge";
import KnowledgePopup from "../components/KnowledgePopup";
import { getStorage } from "../utils/storage";
import WelcomePopup from "../components/WelcomePopup";

/**
 * 🏠 홈 화면
 * - 뉴스 확인(useNewsQuery로 실제 데이터 사용)
 * - 출석 체크
 * - 오늘 할 일 안내
 * 
 * 코인: 아이템 구매용, 머니: 주식 투자용, 점수: 활동 성실도 표시용

 */

const Home = () => {
  const { user, checkToday, expInfo } = useUser();
  const { giveReward } = useReward();
  const { openModal } = useModal();
  const { isSolved, markSolved } = useUser();
  const [activeNews, setActiveNews] = useState<HomeNews | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<NewsQuiz | null>(null);
  const [newsTab, setNewsTab] = useState<"today" | "yesterday">("today"); //뉴스탭
  const [countryTab, setCountryTab] = useState<"KR" | "US">("KR");

  // ✅ 실제 API 데이터 (하루 1번만 호출)
  const { data, isLoading } = useNewsQuery();
  //ㄴ>useQuery로 가져오는 과정에서 string으로 전부 변환됌(주의)

  //웰컴 안내문구(앱 활동하도록 안내 )
  const [showWelcome, setShowWelcome] = useState(
    () => !getStorage("hasCompletedFirstBuy", false),
  );

  // 오늘의 지식 상태
  const {
    hasTodayKnowledge,
    isOpen,
    todayKnowledge,
    openKnowledge,
    confirmKnowledge,
    closeKnowledge,
  } = useKnowledge();

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
    checkToday(giveReward); // ✅ 뉴스 1개라도 읽으면 출석
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
    //정답 결과 팝업
    openModal({
      type: "INFO",
      title: "🎉 오~ 맞췄어!",
      message: "보상을 획득했어요! 🪙✨",
      confirmText: "확인",
      onConfirm: () => {
        //퀴즈 푼 기록
        markSolved(newsId, giveReward); //기록 + 보상
      },
    });
    playCoinSound();
  };

  //날짜
  const today = new Date();
  const month = today.getMonth() + 1;

  // 뉴스 읽은 기록 (퀴즈 푼 뉴스)
  const readNewsIds = user.quizProgress;
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

        <ExpBarCard
          level={expInfo.level}
          currentExp={expInfo.currentExp}
          neededExp={expInfo.neededExp}
          progress={expInfo.progress}
        />
        {/* 💡 오늘의 지식 버튼 */}
        <KnowledgeButton onClick={openKnowledge} $done={hasTodayKnowledge}>
          <KnowledgeEmoji>💡</KnowledgeEmoji>
          <KnowledgeText>
            <KnowledgeTitle>오늘의 지식 한 스푼</KnowledgeTitle>
            <KnowledgeSub>
              {hasTodayKnowledge
                ? "오늘 지식 완료! ✅"
                : "탭해서 지식 얻기 +EXP 🧠"}
            </KnowledgeSub>
          </KnowledgeText>
          {!hasTodayKnowledge && <Reward>+20 EXP</Reward>}
          {!hasTodayKnowledge && <NewBadge>NEW</NewBadge>}
        </KnowledgeButton>
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
            🔥 <StreakNumber>{user.streak}</StreakNumber>일 연속
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
      {/* 🧠 오늘의 지식 모달 */}
      {isOpen && todayKnowledge && (
        <KnowledgePopup
          knowledge={todayKnowledge}
          onConfirm={confirmKnowledge}
          onClose={closeKnowledge}
          isDone={hasTodayKnowledge}
        />
      )}
      {/* 웰컴팝업 */}
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px 5px;
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
  align-items: center;
  font-weight: 800;
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
`;

const Progress = styled.span`
  font-size: 10px;
  margin-left: 2px;
  color: ${({ theme }) => theme.colors.secondary};
  white-space: nowrap; /* 0 / 2 줄바꿈 방지 */
`;
const CalendarSection = styled.section`
  position: relative;

  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.card};

  box-shadow: ${({ theme }) => theme.shadows.lg};

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
  border-radius: ${({ theme }) => theme.radius.md};

  background-color: ${({ theme }) => theme.colors.surface};

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 14px;
  font-weight: 700;
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

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const KnowledgeButton = styled.button<{ $done: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $done }) =>
    $done ? theme.colors.surface : theme.colors.primary + "15"};
  cursor: pointer;
  text-align: left;
  border: 2px solid
    ${({ theme, $done }) =>
      $done ? theme.colors.border : theme.colors.primary + "40"};
  animation: ${({ $done }) =>
    $done
      ? "none"
      : css`
          ${pulse} 2s ease-in-out infinite
        `};
  transition: all 0.15s ease;
  &:active {
    transform: scale(0.97);
  }
`;

const KnowledgeEmoji = styled.span`
  font-size: 24px;
`;

const KnowledgeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const KnowledgeTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const KnowledgeSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const NewBadge = styled.div`
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
`;

const Reward = styled.div`
  position: absolute;
  top: 10px;
  right: 60px;

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
export default Home;
