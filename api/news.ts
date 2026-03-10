// Vercel 서버리스 함수 타입
import type { VercelRequest, VercelResponse } from "@vercel/node";

// -----------------------------
// 1️⃣ 하루 캐싱을 위한 변수
// -----------------------------
// 서버가 살아있는 동안 메모리에 저장됨
// 같은 날이면 Gemini API를 다시 호출하지 않음
let cachedNews: any = null;
let cachedDate: string | null = null;

// -----------------------------
// 2️⃣ Gemini에게 보낼 프롬프트 생성 함수
// -----------------------------
const buildPrompt = (articles: { title: string; description: string }[]) => {
  // 뉴스 제목 + 설명을 하나의 문자열로 합침
  const articleText = articles
    .map((a, i) => `${i + 1}. 제목: ${a.title}\n내용: ${a.description}`)
    .join("\n\n");

  // Gemini에게 보낼 프롬프트
  return `
너는 초등학생에게 주식과 경제를 가르치는 선생님이야.

아래 뉴스 ${articles.length}개를 읽고
어린이가 이해할 수 있게 설명해줘.

각 뉴스마다 퀴즈도 하나 만들어줘.

${articleText}

반드시 아래 JSON 형식으로만 답해.

{
 "news":[
   {
     "id":"news_0",
     "title":"어린이용 제목",
     "summary":"어린이용 설명",
     "stockId":"0"
   }
 ],
 "quizzes":[
   {
     "newsId":"news_0",
     "question":"퀴즈 질문",
     "options":["보기1","보기2","보기3"],
     "answerIndex":0
   }
 ]
}
   규칙:
- news_0 ~ news_2 (앞 3개) → "type": "today"  (오늘의 뉴스)
- news_3 ~ news_5 (뒤 3개) → "type": "missed" (어제 놓친 뉴스)
- 반드시 6개 모두 작성
`;
};

// -----------------------------
// 3️⃣ Vercel 서버리스 API 시작
// -----------------------------
export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  // 오늘 날짜 (뉴스 하루 캐싱용)
  const today = new Date().toISOString().slice(0, 10);

  // -----------------------------
  // 4️⃣ 캐시된 뉴스가 있으면 바로 반환
  // -----------------------------
  if (cachedNews && cachedDate === today) {
    return res.status(200).json(cachedNews);
  }

  try {
    // -----------------------------
    // 5️⃣ RSS 뉴스 가져오기
    // -----------------------------
    // 매일경제 경제 뉴스 RSS 사용
    const newsRes = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://www.mk.co.kr/rss/40300001/",
    );
    console.log("😍", newsRes);
    const newsData = await newsRes.json();

    // 상위 뉴스 6개만 사용
    const articles = newsData.items.slice(0, 6).map((a: any) => ({
      title: a.title,
      description: a.description,
    }));

    // -----------------------------
    // 6️⃣ Gemini AI 호출
    // -----------------------------
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt(articles),
                },
              ],
            },
          ],
        }),
      },
    );

    const geminiData = await geminiRes.json();

    // -----------------------------
    // 7️⃣ Gemini 응답에서 텍스트 추출
    // -----------------------------
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    // 응답이 없으면 에러 반환
    if (!raw) {
      return res.status(500).json({
        error: "Gemini 응답 없음",
        gemini: geminiData,
      });
    }

    // -----------------------------
    // 8️⃣ Gemini 응답에서 JSON 부분만 추출
    // -----------------------------
    // AI가 설명을 붙일 수도 있어서 JSON만 찾아서 파싱
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      return res.status(500).json({
        error: "JSON 찾기 실패",
        raw,
      });
    }

    const parsed = JSON.parse(match[0]);

    // -----------------------------
    // 9️⃣ 뉴스 타입 추가
    // -----------------------------
    // 앞 3개 = 오늘 뉴스
    // 뒤 3개 = 놓친 뉴스
    parsed.news = parsed.news.map((news: any, i: number) => ({
      ...news,
      type: i < 3 ? "today" : "missed",
    }));

    // -----------------------------
    // 🔟 최종 결과
    // -----------------------------
    const result = {
      ...parsed,
      date: today,
    };

    // -----------------------------
    // 11️⃣ 캐시에 저장
    // -----------------------------
    cachedNews = result;
    cachedDate = today;

    // 프론트에 데이터 반환
    return res.status(200).json(result);
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      error: "서버 에러",
      detail: String(err),
    });
  }
}
