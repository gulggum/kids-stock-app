import { useState } from "react";
import styled from "styled-components";

/**
 * 관리자 뉴스 생성 페이지
 *
 * Step1 → 뉴스 입력
 * Step2 → 뉴스 수정
 * Step3 → 미리보기
 */

type NewsItem = {
  title: string;
  summary: string;
  image: string;
  companies: string[];
};

type Step = "input" | "edit" | "preview";

const AdminNewsCreate = () => {
  const [step, setStep] = useState<Step>("input");

  const [inputs, setInputs] = useState<string[]>(["", "", "", "", "", ""]);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [published, setPublished] = useState<NewsItem[]>([]);

  const handleInput = (index: number, value: string) => {
    const copy = [...inputs];
    copy[index] = value;
    setInputs(copy);
  };

  /**
   * AI 요약 (mock)
   */
  const handleGenerate = () => {
    const result = inputs
      .filter((v) => v.trim() !== "")
      .map((_, i) => ({
        title: `뉴스 ${i + 1}`,
        summary:
          "AI가 어린이를 위해 쉽게 설명한 경제 뉴스입니다. 기업 활동과 시장 변화를 이해할 수 있도록 정리되었습니다.",
        image: "https://picsum.photos/seed/computer/400/200",
        companies: ["삼성전자", "애플"],
      }));

    setNews(result);
    setStep("edit");
  };

  /**
   * 관리자 수정
   */
  const updateNews = (index: number, field: string, value: any) => {
    const copy = [...news];
    // @ts-ignore
    copy[index][field] = value;
    setNews(copy);
  };

  /**
   * 게시
   */
  const handlePublish = () => {
    setPublished(news);
    alert("뉴스 게시 완료!");
  };

  return (
    <Container>
      <Title>오늘 뉴스 생성</Title>

      {/* STEP 1 : 뉴스 입력 */}

      {step === "input" && (
        <Section>
          <SectionTitle>뉴스 원문 입력</SectionTitle>

          {inputs.map((v, i) => (
            <Textarea
              key={i}
              placeholder={`뉴스 ${i + 1}`}
              value={v}
              onChange={(e) => handleInput(i, e.target.value)}
            />
          ))}

          <Button onClick={handleGenerate}>AI 요약 생성</Button>
        </Section>
      )}

      {/* STEP 2 : 수정 */}

      {step === "edit" && (
        <Section>
          <SectionTitle>뉴스 수정</SectionTitle>

          {news.map((item, i) => (
            <Card key={i}>
              <Input
                value={item.title}
                onChange={(e) => updateNews(i, "title", e.target.value)}
              />

              <Input
                placeholder="이미지 URL"
                value={item.image}
                onChange={(e) => updateNews(i, "image", e.target.value)}
              />

              <Textarea
                value={item.summary}
                onChange={(e) => updateNews(i, "summary", e.target.value)}
              />

              <CompanyRow>
                {item.companies.map((c, idx) => (
                  <Tag key={idx}>{c}</Tag>
                ))}
              </CompanyRow>
            </Card>
          ))}

          <ButtonRow>
            <Button onClick={() => setStep("input")}>뒤로</Button>
            <Button onClick={() => setStep("preview")}>미리보기</Button>
          </ButtonRow>
        </Section>
      )}

      {/* STEP 3 : 미리보기 */}

      {step === "preview" && (
        <Section>
          <SectionTitle>홈 미리보기</SectionTitle>

          <PreviewGrid>
            {news.map((item, i) => (
              <PreviewCard key={i}>
                <PreviewImage src={item.image} />

                <PreviewTitle>{item.title}</PreviewTitle>

                <PreviewText>{item.summary}</PreviewText>

                <CompanyRow>
                  {item.companies.map((c, idx) => (
                    <Tag key={idx}>{c}</Tag>
                  ))}
                </CompanyRow>
              </PreviewCard>
            ))}
          </PreviewGrid>

          <ButtonRow>
            <Button onClick={() => setStep("edit")}>수정</Button>
            <PublishButton onClick={handlePublish}>뉴스 게시</PublishButton>
          </ButtonRow>
        </Section>
      )}
    </Container>
  );
};

export default AdminNewsCreate;

/* 스타일 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 22px;
`;

const Section = styled.div`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h3`
  margin-bottom: 12px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

const Card = styled.div`
  padding: 14px;
  margin-bottom: 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CompanyRow = styled.div`
  display: flex;
  gap: 6px;
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentBlue};
  color: white;
  font-size: 12px;
`;

const PublishButton = styled.button`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentGreen};
  color: white;
  border: none;
  cursor: pointer;
`;

const PreviewGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const PreviewCard = styled.div`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-bottom: 8px;
`;

const PreviewTitle = styled.h4`
  margin-bottom: 6px;
`;

const PreviewText = styled.p`
  font-size: 14px;
`;
