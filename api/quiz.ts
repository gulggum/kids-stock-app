import type { VercelRequest, VercelResponse } from "@vercel/node";

// 개발 환경 mock
const devQuiz = {
  newsId: "dev",
  question: "이 뉴스는 무엇에 대한 이야기일까요?",
  options: ["주식", "날씨", "축구"],
  answerIndex: 0,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST만 허용됩니다" });
  }

  const { title, summary, newsId } = req.body;

  // 개발환경 → mock
  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      ...devQuiz,
      newsId,
    });
  }

  try {
    const prompt = `
초등학생을 위한 경제 퀴즈를 만들어줘.

뉴스:
제목: ${title}
내용: ${summary}

JSON 형식으로만 답해.

{
 "question":"퀴즈 질문",
 "options":["보기1","보기2","보기3"],
 "answerIndex":0
}
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const geminiData = await geminiRes.json();

    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      return res.status(500).json({
        error: "Gemini 응답 없음",
        gemini: geminiData,
      });
    }

    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      return res.status(500).json({
        error: "JSON 파싱 실패",
        raw,
      });
    }

    const parsed = JSON.parse(match[0]);

    return res.status(200).json({
      newsId,
      ...parsed,
    });
  } catch (err) {
    console.error("QUIZ ERROR:", err);

    return res.status(500).json({
      error: "quiz server error",
    });
  }
}
