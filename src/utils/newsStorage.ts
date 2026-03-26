import { mockNewsData, type NewsResponse } from "../data/mock/homeNewsMockData";
import { getStorage, setStorage } from "./storage";

const STORAGE_KEY = "kidsStock_news";

/**
 * 뉴스 가져오기
 */
export const getNews = (): NewsResponse => {
  return getStorage(STORAGE_KEY, mockNewsData);
};

/**
 * 뉴스 저장
 */
export const saveNews = (newsData: NewsResponse) => {
  setStorage(STORAGE_KEY, newsData);
};
