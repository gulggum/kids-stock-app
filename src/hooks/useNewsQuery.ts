//하루 1번 캐싱

// 🔄 역할: 뉴스 데이터를 가져오고 하루 동안 캐싱
//         새로고침해도 오늘 이미 불러왔으면 API 재호출 안 함!

import { useQuery } from "@tanstack/react-query";
import { type HomeNews } from "../data/mock/homeNews";
import { type NewsQuiz } from "../data/mock/newsQuiz";

type NewsResponse = {
  news: HomeNews[];
  quizzes: NewsQuiz[];
  date: string; // "2025-03-06"
};

const fetchTodayNews = async (): Promise<NewsResponse> => {
  const res = await fetch("/api/news"); // Vercel 서버리스 함수 호출
  if (!res.ok) throw new Error("뉴스 불러오기 실패");
  return res.json();
};

export const useNewsQuery = () => {
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["news", today], // 날짜가 바뀌면 자동으로 새로 호출!
    queryFn: fetchTodayNews,
    staleTime: 1000 * 60 * 60 * 24, // ✅ 24시간 캐싱 → 새로고침해도 API 안 씀
    retry: 1, // 실패 시 1번만 재시도
  });
};
