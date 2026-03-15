import { useQuery } from "@tanstack/react-query";
import { mockNewsData, type HomeNews } from "../data/mock/homeNewsMockData";
import { type NewsQuiz } from "../data/mock/homeNewsMockData";
// import { mockNewsData } from "../data/mock/homeNewsMockData";

/**
 * 뉴스 가져오기
 * 개발환경에서는 localStorage 사용
 * 운영환경에서는 API 호출
 */
type NewsResponse = {
  news: HomeNews[];
  quizzes: NewsQuiz[];
  date: string; // "2025-03-06"
};

//API 호출하는 함수
const fetchTodayNews = async (): Promise<NewsResponse> => {
  //프론트 mock
  if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true") {
    return mockNewsData; //getData()하면 관리자페이지 적용가능
  }

  const res = await fetch("/api/news");

  if (!res.ok) {
    throw new Error("뉴스 API 실패");
  }

  return res.json();
};

//react query 훅
export const useNewsQuery = () => {
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["news", today], // 날짜가 바뀌면 자동으로 새로 호출!
    queryFn: fetchTodayNews,
    staleTime: 1000 * 60 * 60 * 24, // ✅ 24시간 캐싱 → 새로고침해도 API 안 씀
    retry: 1, // 실패 시 1번만 재시도
  });
};
