/**
 * 📰 홈에서 보여줄 뉴스 mock 데이터
 * - 실제 API 대신 AI 설명용 문구
 * - 날짜/카테고리만 바꿔도 "업데이트된 느낌" 남
 */

export type HomeNews = {
  id: string;
  title: string;
  summary: string;
  stockId: string; //연결될 주식
  type: "today" | "missed";
};
