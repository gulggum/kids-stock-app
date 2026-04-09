import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import type { HomeNews, NewsQuiz } from "../types/newsType";

/**
 * 뉴스 가져오기 훅
 *
 * [흐름]
 * 1. Supabase news 테이블에서 최신순으로 12개 가져옴
 * 2. 가장 최근 날짜 → "today"
 *    그 다음 날짜  → "yesterday"
 *    자동 분류 (내가 못 올린 날도 자동으로 유지됨)
 * 3. 퀴즈도 같이 가져와서 반환
 *
 * [캐싱]
 * - staleTime 24시간 → 같은 날은 재호출 안 함
 * - queryKey에 날짜 포함 → 날짜 바뀌면 자동 새로 호출
 */

type NewsResponse = {
  news: HomeNews[];
  quizzes: NewsQuiz[];
  date: string;
};

const fetchTodayNews = async (): Promise<NewsResponse> => {
  const today = new Date().toISOString().slice(0, 10);

  // 1️⃣ 최신순으로 뉴스 가져오기 (오늘 6개 + 어제 6개 = 최대 12개)
  const { data: newsData, error: newsError } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false })
    .limit(12);

  if (newsError) throw new Error(newsError.message);

  // 2️⃣ 날짜 목록에서 가장 최근 2개 날짜 추출
  const dates = [...new Set((newsData ?? []).map((n) => n.date))]
    .sort()
    .reverse();

  const latestDate = dates[0]; // 가장 최근 날짜 → today
  const secondDate = dates[1]; // 그 다음 날짜  → yesterday (못 올린 날 있어도 OK)

  // 3️⃣ 최근 2개 날짜 뉴스만 필터링 + type 자동 분류
  const news: HomeNews[] = (newsData ?? [])
    .filter((n) => n.date === latestDate || n.date === secondDate)
    .map((n) => ({
      id: n.id,
      title: n.title,
      summary: n.summary,
      image: n.image ?? undefined,
      stockIds: n.stock_ids ?? [],
      type: n.date === latestDate ? "today" : "yesterday",
      country: n.country,
      createdAt: n.created_at,
    }));

  // 4️⃣ 해당 뉴스들의 퀴즈 가져오기
  const newsIds = news.map((n) => n.id);

  const { data: quizData, error: quizError } = await supabase
    .from("news_quizzes")
    .select("*")
    .in("news_id", newsIds);

  if (quizError) throw new Error(quizError.message);

  // 5️⃣ snake_case → camelCase 변환
  const quizzes: NewsQuiz[] = (quizData ?? []).map((q) => ({
    newsId: q.news_id,
    question: q.question,
    options: q.options,
    answerIndex: q.answer_index,
  }));

  return { news, quizzes, date: latestDate ?? today };
};

export const useNewsQuery = () => {
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["news", today],
    queryFn: fetchTodayNews,
    staleTime: 1000 * 60 * 60 * 24, // 24시간 캐싱
    retry: 1,
  });
};
