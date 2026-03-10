//하루 1번 캐싱

// 🔄 역할: 뉴스 데이터를 가져오고 하루 동안 캐싱
//         새로고침해도 오늘 이미 불러왔으면 API 재호출 안 함!

import { useQuery } from "@tanstack/react-query";
import { type HomeNews } from "../data/mock/homeNews";

type NewsQuiz = {
  newsId: string;
  question: string;
  options: string[];
  answerIndex: number;
};

type NewsResponse = {
  news: HomeNews[];
  quizzes: NewsQuiz[];
  date: string; // "2025-03-06"
};

//API 호출하는 함수
const fetchTodayNews = async (): Promise<NewsResponse> => {
  //프론트 mock
  if (import.meta.env.DEV) {
    return {
      news: [
        {
          id: "news_0",
          title: "오늘 반도체 회사가 돈을 많이 벌었어요",
          summary:
            "컴퓨터와 스마트폰에 들어가는 반도체를 많이 팔아서 회사가 돈을 많이 벌었어요.",
          stockId: "0",
          type: "today",
        },
        {
          id: "news_1",
          title: "전기차가 점점 많아지고 있어요",
          summary: "기름 대신 전기를 사용하는 자동차가 점점 많아지고 있어요.",
          stockId: "1",
          type: "today",
        },
        {
          id: "news_2",
          title: "어제는 게임 회사 주식이 올랐어요",
          summary:
            "새로운 게임이 인기를 얻으면서 게임 회사의 가치가 올라갔어요.",
          stockId: "2",
          type: "missed",
        },
      ],

      quizzes: [
        {
          newsId: "news_0",
          question: "반도체는 어디에 많이 사용될까요?",
          options: ["컴퓨터와 스마트폰", "자동차 바퀴", "축구공"],
          answerIndex: 0,
        },
        {
          newsId: "news_1",
          question: "전기차는 무엇으로 움직일까요?",
          options: ["전기", "물", "바람"],
          answerIndex: 0,
        },
        {
          newsId: "news_2",
          question: "게임 회사 주식이 오른 이유는?",
          options: ["새 게임이 인기", "날씨가 좋아서", "비가 와서"],
          answerIndex: 0,
        },
      ],
      date: new Date().toISOString().slice(0, 10),
    };
  }

  const res = await fetch("https://kids-stock-app.vercel.app/api/news");

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
