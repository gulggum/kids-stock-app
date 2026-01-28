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
};

export const todayNews: HomeNews = {
  id: "today",
  title: "오늘의 뉴스",
  summary: "AI를 쓰는 회사가 늘어나면서, 관련 주식이 요즘 주목받고 있어요.",
  stockId: "0",
};

export const missedNews: HomeNews[] = [
  {
    id: "n1",
    title: "밤사이 있었던 일",
    summary: "전기차를 찾는 사람이 많아져서, 자동차 회사 주가가 움직였어요.",
    stockId: "0",
  },
  {
    id: "n2",
    title: "요즘 이런 회사가 있어요",
    summary: "게임을 만드는 회사가 인기를 얻으면서 관심을 받고 있어요.",
    stockId: "0",
  },
];
