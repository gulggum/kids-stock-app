import { useState } from "react";
import styled from "styled-components";
import { ClipboardPaste, Send, RotateCcw, CheckCircle } from "lucide-react";
import { supabase } from "../../utils/supabase";
import type {
  HomeNews,
  NewsQuiz,
  NewsResponse,
} from "../../data/mock/homeNewsMockData";

/**
 * 관리자 뉴스 생성 페이지
 *
 * Step1 → JSON 붙여넣기  (ChatGPT에서 복사)
 * Step2 → 미리보기 + 수정
 * Step3 → Supabase 게시
 */

type Step = "paste" | "preview" | "done";

const AdminNewsCreate = () => {
  const [step, setStep] = useState<Step>("paste");
  const [jsonInput, setJsonInput] = useState("");
  const [parsed, setParsed] = useState<NewsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10); //한국시간기준

  // --------------------------------------------------
  // JSON 파싱
  // --------------------------------------------------
  const handleParse = () => {
    setError("");
    try {
      const data = JSON.parse(jsonInput) as NewsResponse;

      // ✅ contentReference 자동 제거
      data.news = data.news.map((item) => ({
        ...item,
        summary: item.summary
          .replace(/:contentReference\[.*?\]\{.*?\}/g, "")
          .trim(),
      }));

      // 기본 유효성 검사
      if (!data.news || !Array.isArray(data.news)) {
        throw new Error("news 배열이 없어요");
      }
      if (!data.quizzes || !Array.isArray(data.quizzes)) {
        throw new Error("quizzes 배열이 없어요");
      }

      setParsed(data);
      setStep("preview");
    } catch (e: any) {
      setError(`JSON 형식이 올바르지 않아요: ${e.message}`);
    }
  };

  // --------------------------------------------------
  // Supabase 게시
  // --------------------------------------------------
  const handlePublish = async () => {
    if (!parsed) return;
    setLoading(true);

    try {
      // 1️⃣ news 테이블 upsert
      const newsRows = parsed.news.map((item: HomeNews) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        image: item.image ?? null,
        stock_ids: item.stockIds ?? [],
        type: item.type,
        country: item.country,
        date: today,
        created_at: new Date().toISOString(),
      }));

      const { error: newsError } = await supabase
        .from("news")
        .upsert(newsRows, { onConflict: "id" });

      if (newsError) throw newsError;

      // 2️⃣ news_quizzes 테이블 upsert
      const quizRows = parsed.quizzes.map((q: NewsQuiz) => ({
        news_id: q.newsId,
        question: q.question,
        options: q.options,
        answer_index: q.answerIndex,
      }));

      const { error: quizError } = await supabase
        .from("news_quizzes")
        .upsert(quizRows, { onConflict: "news_id" });

      if (quizError) throw quizError;

      setStep("done");
    } catch (e: any) {
      setError(`게시 실패: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // 초기화
  // --------------------------------------------------
  const handleReset = () => {
    setStep("paste");
    setJsonInput("");
    setParsed(null);
    setError("");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <Container>
      {/* 단계 표시 */}
      <StepRow>
        <StepDot $active={step === "paste"} $done={step !== "paste"}>
          1
        </StepDot>
        <StepLine />
        <StepDot $active={step === "preview"} $done={step === "done"}>
          2
        </StepDot>
        <StepLine />
        <StepDot $active={step === "done"} $done={false}>
          3
        </StepDot>
      </StepRow>

      {/* ======================== STEP 1 : JSON 붙여넣기 ======================== */}
      {step === "paste" && (
        <>
          <SectionTitle>📋 JSON 붙여넣기</SectionTitle>

          <SectionCard>
            <GuideItem>
              <GuideNum>1</GuideNum>
              <GuideText>ChatGPT에서 아래 프롬프트로 JSON을 받아요</GuideText>
            </GuideItem>
            <GuideItem>
              <GuideNum>2</GuideNum>
              <GuideText>받은 JSON을 아래 창에 붙여넣기 해요</GuideText>
            </GuideItem>
            <GuideItem $last>
              <GuideNum>3</GuideNum>
              <GuideText>파싱 버튼을 눌러요</GuideText>
            </GuideItem>
          </SectionCard>

          {/* ChatGPT 프롬프트 복사용 */}
          <SectionTitle>💬 ChatGPT 프롬프트 (복사해서 사용)</SectionTitle>
          <PromptBox>
            {`너는 어린이경제신문에서 일하는 기자야.

내가 주는 한국 경제 뉴스 3개 + 세계 경제 뉴스 3개를
초등학생도 흥미롭게 읽을 수 있는 “스토리형 경제 기사”로 다시 작성해줘.

[작성 규칙]

1. 제목(title)
- 어린이 경제신문 헤드라인 스타일로 작성
- 반드시 “충격 / 변화 / 궁금증”이 느껴지게 작성(예: 기름값 상승 쇼크! 물가 흔든다)
- “~쇼크”, “~비상”, “~흔든다”, “왜 ~일까?” 같은 표현 활용
- 핵심 경제 키워드(물가, 금리, 반도체 등) 포함
- 20자 이내

2. 본문(summary)
- 스토리형식으로 문해력에도 도움될수 있도록
- 최대 7줄 이내
- 첫 문장은 아이가 궁금해할 질문 또는 상황으로 시작
  (예: “왜 요즘 기름값이 비싸졌을까?”)
- 중간에는 실제 경제 상황을 쉽게 설명
- 반드시 핵심 경제 용어(금리, 인플레이션, 원유 등)는 그대로 사용
- 마지막 문장은 “그래서 우리 생활에 어떤 영향이 있는지”로 마무리

3. 말투
- “~했어요”, “~이에요” 형태의 부드러운 설명체
- 너무 딱딱하지 않게, 약간의 놀람/궁금함 느낌 허용 (과하지 않게)

4. 출력 형식
- 반드시 JSON 형식으로만 출력 (추가 설명 절대 금지)

{
  "news": [
    {
      "id": "news_today_kr_1",
      "title": "",
      "summary": "",
      "image": "",
      "stockIds": ["관련기업1", "관련기업2"],
      "type": "today",
      "country": "KR",
      "createdAt": "YYYY-MM-DD"
    }
  ],
  "quizzes": [
    {
      "newsId": "news_today_kr_1",
      "question": "뉴스 내용을 기반으로 한 퀴즈",
      "options": ["보기1", "보기2", "보기3"],
      "answerIndex": 0
    }
  ],
  "date": "YYYY-MM-DD"
}

규칙:
- KR 뉴스 id: news_2026-${today}_kr_1 ~ news_2026-${today}_kr_3
- US 뉴스 id: news_2026-${today}_us_1 ~ news_2026-${today}_us_3
- 오늘 날짜를 YYYY-MM-DD 형식으로 id에 포함
- 뉴스는 총 6개 작성
- 각 뉴스마다 퀴즈 1개 (총 6개)
- answerIndex는 반드시 0, 1, 2 중 하나
- stockIds는 뉴스와 관련된 대표 기업 2개 (예: 삼성전자, 애플 등)
- createdAt과 date는 오늘 날짜로 동일하게 작성`}
          </PromptBox>

          <SectionTitle>📥 JSON 입력</SectionTitle>

          <SectionCard style={{ padding: "12px" }}>
            <JsonTextarea
              placeholder="여기에 ChatGPT에서 받은 JSON을 붙여넣기 해주세요..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
          </SectionCard>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <ActionButton onClick={handleParse} disabled={!jsonInput.trim()}>
            <ClipboardPaste size={16} />
            파싱하기
          </ActionButton>
        </>
      )}

      {/* ======================== STEP 2 : 미리보기 ======================== */}
      {step === "preview" && parsed && (
        <>
          <SectionTitle>👀 뉴스 미리보기 ({parsed.news.length}개)</SectionTitle>

          {parsed.news.map((item) => {
            const quiz = parsed.quizzes.find((q) => q.newsId === item.id);
            return (
              <SectionCard key={item.id}>
                <PreviewHeader>
                  <CountryBadge $country={item.country}>
                    {item.country === "KR" ? "🇰🇷 한국" : "🌎 세계"}
                  </CountryBadge>
                  <TypeBadge>{item.type}</TypeBadge>
                </PreviewHeader>

                <PreviewRow $last={false}>
                  <PreviewLabel>제목</PreviewLabel>
                  <PreviewValue>{item.title}</PreviewValue>
                </PreviewRow>

                <PreviewRow $last={false}>
                  <PreviewLabel>요약</PreviewLabel>
                  <PreviewValue>{item.summary}</PreviewValue>
                </PreviewRow>

                {quiz && (
                  <PreviewRow $last>
                    <PreviewLabel>퀴즈</PreviewLabel>
                    <QuizBox>
                      <QuizQuestion>{quiz.question}</QuizQuestion>
                      {quiz.options.map((opt, i) => (
                        <QuizOption key={i} $correct={i === quiz.answerIndex}>
                          {i === quiz.answerIndex ? "✅" : "○"} {opt}
                        </QuizOption>
                      ))}
                    </QuizBox>
                  </PreviewRow>
                )}
                {item.stockIds && item.stockIds.length > 0 && (
                  <PreviewRow $last>
                    <PreviewLabel>주식</PreviewLabel>
                    <StockRow>
                      {item.stockIds.map((id, i) => (
                        <StockTag key={i}>#{id}</StockTag>
                      ))}
                    </StockRow>
                  </PreviewRow>
                )}
              </SectionCard>
            );
          })}

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <ButtonRow>
            <BackButton onClick={() => setStep("paste")}>
              <RotateCcw size={14} />
              다시 입력
            </BackButton>
            <ActionButton onClick={handlePublish} disabled={loading}>
              <Send size={16} />
              {loading ? "게시 중..." : "Supabase에 게시"}
            </ActionButton>
          </ButtonRow>
        </>
      )}

      {/* ======================== STEP 3 : 완료 ======================== */}
      {step === "done" && (
        <>
          <SectionTitle>✅ 게시 완료</SectionTitle>

          <SectionCard>
            <DoneContent>
              <CheckCircle size={48} color="#6BCB3D" />
              <DoneTitle>뉴스가 성공적으로 게시됐어요!</DoneTitle>
              <DoneDesc>홈 화면에서 오늘의 뉴스를 확인할 수 있어요.</DoneDesc>
            </DoneContent>
          </SectionCard>

          <ActionButton onClick={handleReset}>
            <RotateCcw size={16} />새 뉴스 등록
          </ActionButton>
        </>
      )}
    </Container>
  );
};

export default AdminNewsCreate;

/* ======================== 스타일 ======================== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 단계 표시
const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 16px 4px 8px;
`;

const StepDot = styled.div<{ $active: boolean; $done: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
  background: ${({ $active, $done, theme }) =>
    $done
      ? theme.colors.primary
      : $active
        ? theme.colors.primary
        : theme.colors.surface};
  color: ${({ $active, $done, theme }) =>
    $done || $active ? "white" : theme.colors.muted};
  opacity: ${({ $active, $done }) => ($active || $done ? 1 : 0.4)};
`;

const StepLine = styled.div`
  flex: 1;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};
`;

// 섹션 공통
const SectionTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  margin: 8px 4px 0;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

// 가이드
const GuideItem = styled.div<{ $last?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: ${({ $last, theme }) =>
    $last ? "none" : `1px solid ${theme.colors.background}`};
`;

const GuideNum = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const GuideText = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

// 프롬프트 박스
const PromptBox = styled.pre`
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

// JSON 입력
const JsonTextarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  font-family: monospace;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

// 미리보기
const PreviewHeader = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px 0;
`;

const CountryBadge = styled.span<{ $country: string }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $country }) => ($country === "KR" ? "#EBF5FB" : "#FEF9E7")};
  color: ${({ $country }) => ($country === "KR" ? "#2E8EDB" : "#F39C12")};
`;

const TypeBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
`;

const PreviewRow = styled.div<{ $last: boolean }>`
  display: flex;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: ${({ $last, theme }) =>
    $last ? "none" : `1px solid ${theme.colors.background}`};
`;

const PreviewLabel = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  width: 36px;
  flex-shrink: 0;
  padding-top: 2px;
`;

const PreviewValue = styled.p`
  font-size: 13px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  flex: 1;
`;

const QuizBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const QuizQuestion = styled.p`
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.text};
`;

const QuizOption = styled.p<{ $correct: boolean }>`
  font-size: 12px;
  margin: 0;
  color: ${({ $correct, theme }) =>
    $correct ? "#6BCB3D" : theme.colors.muted};
  font-weight: ${({ $correct }) => ($correct ? 700 : 400)};
`;

const StockRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
`;

const StockTag = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// 버튼
const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 4px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
`;

// 에러
const ErrorMsg = styled.p`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: #fff0f0;
  color: #e74c3c;
  font-size: 13px;
  font-weight: 600;
  margin: 0;
`;

// 완료
const DoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 16px;
`;

const DoneTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const DoneDesc = styled.p`
  font-size: 14px;
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`;
