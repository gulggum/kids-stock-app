import { mockNewsData } from "../data/mock/homeNewsMockData";

const STORAGE_KEY = "kidsStock_news";

/**
 * 뉴스 가져오기
 */
export const getNews = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNewsData));
    return mockNewsData;
  }

  return JSON.parse(saved);
};

/**
 * 뉴스 저장
 */
export const saveNews = (newsData: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newsData));
};
