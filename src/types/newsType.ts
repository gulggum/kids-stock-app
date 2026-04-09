export type NewsType = "today" | "yesterday";
export type NewsCountry = "KR" | "US";

export type HomeNews = {
  id: string;
  title: string;
  summary: string;
  image?: string;
  stockIds?: string[];
  type: NewsType;
  country: NewsCountry;
  createdAt: string;
};

export type NewsQuiz = {
  newsId: string;
  question: string;
  options: string[];
  answerIndex: number;
};

export type NewsResponse = {
  news: HomeNews[];
  quizzes: NewsQuiz[];
  date: string;
};

// user_news_log 연결할 때 쓸 타입
export type UserNewsLog = {
  userId: string;
  newsId: string;
  read: boolean;
  quizDone: boolean;
  rewarded: boolean;
  date: string;
};
