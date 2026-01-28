import styled from "styled-components";
import { useAttendance } from "../context/AttendanceContext";
import { missedNews, todayNews } from "../data/homeNews";
import { useNavigate } from "react-router";
import AttendanceCalendar from "../components/AttendanceCalendar";

/**
 * 🏠 홈 화면
 * - 뉴스 확인
 * - 출석 체크
 * - 오늘 할 일 안내
 */

const Home = () => {
  const navigate = useNavigate();
  const { checkToday, streak } = useAttendance();

  const handleReadNews = (stockId: string) => {
    //뉴스 1개라도 읽으면 출석 처리
    checkToday();
    //관련 주식 상세로 이동
    navigate(`/stock/${stockId}`);
  };

  return (
    <Wrapper>
      {/* 📰 오늘의 뉴스 */}
      <Section>
        <SectionTitle>📰 오늘의 뉴스</SectionTitle>
        <Card onClick={() => handleReadNews(todayNews.stockId)}>
          <strong>{todayNews.title}</strong>
          <p>{todayNews.summary}</p>
        </Card>
      </Section>

      {/* 🌙 놓친 뉴스 */}
      <Section>
        <SectionTitle>🌙 자면서 놓친 뉴스</SectionTitle>
        {missedNews.map((news) => (
          <Card key={news.id} onClick={() => handleReadNews(todayNews.stockId)}>
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
