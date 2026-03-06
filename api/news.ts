// 🔒 역할: API 키를 서버에서만 사용하는 서버리스 함수
//         브라우저에서 직접 호출하면 키가 노출되므로 여기서 처리!
// Vercel 서버리스 함수

import type { VercelRequest, VercelResponse } from "@vercel/node";

//메모리 캐시 변수
let cachedNews: any = null;
let cachedDate: string | null = null;

// Gemini에게 보낼 프롬프트 생성
const buildPrompt = (articles: { title: string; description: string }[]) => {
  const articleText = articles
    .map((a, i) => `${i + 1}. 제목: ${a.title}\n내용: ${a.description}`)
    .join("\n\n");

  return `
너는 초등학생에게 주식과 경제를 가르치는 선생님이야.
아래 뉴스 ${articles.length}개를 읽고, 각각을 어린이가 이해할 수 있게 바꿔줘.
그리고 각 뉴스에 대한 퀴즈 1개씩 만들어줘.

${articleText}

아래 JSON 형식으로만 응답해. 다른 말은 하지 마:
{
  "news": [
    {
      "id": "news_0",
      "title": "어린이용 제목",
      "summary": "어린이용 설명 (2~3문장)",
      "stockId": "0"
    }
  ],
  "quizzes": [
    {
      "newsId": "news_0",
      "question": "퀴즈 질문",
      "options": ["보기1", "보기2", "보기3"],
      "answerIndex": 0
    }
  ]
}
  규칙:
- news_0 ~ news_2 (앞 3개) → "type": "today"  (오늘의 뉴스)
- news_3 ~ news_5 (뒤 3개) → "type": "missed" (어제 놓친 뉴스)
- 반드시 6개 모두 작성
`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET 요청만 허용
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET만 허용돼요" });
  }

  // 개발 중에는 mock 데이터 바로 반환 (API 호출 안 함!)
  // 서버 mock
  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      news: [
        {
          id: "news_0",
          title: "테스트 뉴스 1",
          summary: "개발용 뉴스예요",
          stockId: "0",
          type: "today",
        },
        {
          id: "news_1",
          title: "테스트 뉴스 2",
          summary: "개발용 뉴스예요",
          stockId: "0",
          type: "today",
        },
        {
          id: "news_2",
          title: "테스트 뉴스 3",
          summary: "개발용 뉴스예요",
          stockId: "0",
          type: "today",
        },
        {
          id: "news_3",
          title: "놓친 뉴스 1",
          summary: "어제 뉴스예요",
          stockId: "0",
          type: "missed",
        },
        {
          id: "news_4",
          title: "놓친 뉴스 2",
          summary: "어제 뉴스예요",
          stockId: "0",
          type: "missed",
        },
        {
          id: "news_5",
          title: "놓친 뉴스 3",
          summary: "어제 뉴스예요",
          stockId: "0",
          type: "missed",
        },
      ],
      quizzes: [
        {
          newsId: "news_0",
          question: "테스트 퀴즈?",
          options: ["보기1", "보기2", "보기3"],
          answerIndex: 0,
        },
        {
          newsId: "news_1",
          question: "테스트 퀴즈?",
          options: ["보기1", "보기2", "보기3"],
          answerIndex: 1,
        },
        {
          newsId: "news_2",
          question: "테스트 퀴즈?",
          options: ["보기1", "보기2", "보기3"],
          answerIndex: 2,
        },
        {
          newsId: "news_3",
          question: "테스트 퀴즈?",
          options: ["보기1", "보기2", "보기3"],
          answerIndex: 0,
        },
        {
          newsId: "news_4",
          question: "테스트 퀴즈?",
          options: ["보기1", "보기2", "보기3"],
          answerIndex: 1,
        },
        {
          newsId: "news_5",
          question: "테스트 퀴즈?",
          options: ["보기1", "보기2", "보기3"],
          answerIndex: 2,
        },
      ],
      date: new Date().toISOString().slice(0, 10),
    });
  }
  const today = new Date().toISOString().slice(0, 10);

  if (cachedNews && cachedDate === today) {
    return res.status(200).json(cachedNews);
  }
  try {
    // ① NewsAPI에서 최신 주식/경제 뉴스 가져오기
    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=6&apiKey=${process.env.NEWS_API_KEY}`,
    );
    const newsData = await newsRes.json();

    if (!newsData.articles?.length) {
      return res.status(500).json({ error: "뉴스를 가져오지 못했어요" });
    }

    // 필요한 정보만 추출
    const articles = newsData.articles.map((a: any) => ({
      title: a.title ?? "제목 없음",
      description: a.description ?? a.title ?? "",
    }));

    // ② Gemini에게 어린이용으로 변환 + 퀴즈 생성 요청
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(articles) }] }],
        }),
      },
    );

    const geminiData = await geminiRes.json();
    console.log("GEMINI RAW RESPONSE:", geminiData);

    // Gemini 응답에서 텍스트 추출
    const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // JSON 파싱 (Gemini가 ```json ... ``` 감싸는 경우 제거)
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    parsed.news = parsed.news.map((news: any, i: number) => ({
      ...news,
      type: i < 3 ? "today" : "missed",
    }));

    const result = { ...parsed, date: today };

    cachedNews = result;
    cachedDate = today;

    return res.status(200).json(result);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: "서버 에러",
      detail: String(err),
    });
  }
}
