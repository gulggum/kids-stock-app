//하루 1번 캐싱

// 🔄 역할: 하루에 한번만 뉴스 데이터를 가져오고 하루 동안 캐싱
//         새로고침해도 오늘 이미 불러왔으면 API 재호출 안 함!

import { useQuery } from "@tanstack/react-query";
import { type HomeNews } from "../data/mock/homeNewsMockData";
import { type NewsQuiz } from "../data/mock/homeNewsMockData";
import { mockNewsData } from "../data/mock/homeNewsMockData";

type NewsResponse = {
  news: HomeNews[];
  quizzes: NewsQuiz[];
  date: string; // "2025-03-06"
};

//API 호출하는 함수
const fetchTodayNews = async (): Promise<NewsResponse> => {
  //프론트 mock
  if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true") {
    return mockNewsData;
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
