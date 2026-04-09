import styled from "styled-components";
import { X, BookOpen, Brain } from "lucide-react";
import { type HomeNews } from "../../types/newsType";
import { useStocksQuery } from "../../hooks/useStocksQuery";
import { useNavigate } from "react-router-dom";

/**
 * 📰 뉴스 상세 모달
 * - 뉴스 읽으면 출석 처리
 * - 퀴즈는 선택 사항
 */

const NewsDetailModal = ({
  news,
  onClose,
  onRead,
  onGoQuiz,
}: {
  news: HomeNews;
  onClose: () => void;
  onRead: () => void;
  onGoQuiz: () => void;
}) => {
  const { stocks } = useStocksQuery();
  const navigate = useNavigate();
  // 요약 줄바꿈 처리
  const lines = news.summary
    .split(/\n|(?<=\. )/) // \n 또는 ". " 뒤에서 분리
    .map((l) => l.trim())
    .filter((l) => l !== "");

  // 뉴스 stockIds(기업명)로 실제 주식 찾기
  const companies = stocks.filter((s) => news.stockIds?.includes(s.name));
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        {/* 국가 + 타입 뱃지 */}
        <BadgeRow>
          <CountryBadge>
            {news.country === "KR" ? "🇰🇷 한국" : "🌎 세계"}
          </CountryBadge>
        </BadgeRow>

        {/* 제목 */}
        <Title>{news.title}</Title>

        {/* 구분선 */}
        <Divider />

        {/* 본문 — 줄바꿈 처리 */}
        <ContentBox>
          <ContentIcon>
            <BookOpen size={14} />
          </ContentIcon>
          <ContentLines>
            {lines.map((line, i) => (
              <ContentLine key={i}>{line}</ContentLine>
            ))}
          </ContentLines>
        </ContentBox>

        {/* 관련 기업 — 클릭 시 마켓 상세로 이동 */}
        {companies.length > 0 && (
          <StockRow>
            <CompanyGuide>관련기업 구경가기</CompanyGuide>
            <TagRow>
              {companies.map((company) => (
                <StockTag
                  key={company.id}
                  onClick={() => {
                    onClose(); // 모달 닫고
                    navigate(`/market/${company.id}`);
                  }}
                >
                  #{company.name}
                </StockTag>
              ))}
            </TagRow>
          </StockRow>
        )}

        {/* 퀴즈 안내 */}
        <HintBox>
          <Brain size={14} color="#F39C12" />
          <HintText>퀴즈를 풀면 🪙 코인을 받을 수 있어요!</HintText>
        </HintBox>

        {/* 버튼 */}
        <ButtonGroup>
          <CancelButton onClick={onClose}>나중에</CancelButton>
          <ConfirmButton
            onClick={() => {
              onRead();
              onGoQuiz();
            }}
          >
            퀴즈 풀러 가기 →
          </ConfirmButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default NewsDetailModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end; /* ✅ 모바일 — 아래에서 올라오는 느낌 */
  z-index: 1000;
  padding: 0;

  @media (min-width: 480px) {
    align-items: center;
  }
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 80dvh;
  overflow-y: auto;
  padding: 24px 20px 32px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}
    ${({ theme }) => theme.radius.lg} 0 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  @media (min-width: 480px) {
    border-radius: ${({ theme }) => theme.radius.lg};
    width: 360px;
  }

  animation: unfold 0.35s ease;

  @keyframes unfold {
    0% {
      transform: scaleY(0.1) scaleX(0.8);
      opacity: 0;
    }
    50% {
      transform: scaleY(1.02) scaleX(0.95);
      opacity: 0.8;
    }
    100% {
      transform: scaleY(1) scaleX(1);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
`;

const CountryBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 900;
  margin: 0;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
  padding-right: 32px;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 2px 0;
`;

const ContentBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ContentIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

const ContentLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ContentLine = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  /* 줄 앞에 점 */
  &::before {
    content: "• ";
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

const StockRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

const StockTag = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  &:hover {
    transform: translateX(2px);
    text-decoration: underline;
  }
`;

const HintBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #fff8e1;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const HintText = styled.p`
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  color: #e67e22;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const CancelButton = styled.button`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    opacity: 0.9;
  }
`;
// 관련기업 안내 텍스트
const CompanyGuide = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
`;

// 태그 묶음
const TagRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;
