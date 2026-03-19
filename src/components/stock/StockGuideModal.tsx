import InfoModal from "../InfoModal";
import styled from "styled-components";

/**
 * 📌 StockGuideModal
 *
 * 👉 역할
 * - 첫 투자 시 보여주는 "투자 약속" 모달
 * - 체크박스 + 확인 버튼 포함
 *
 * 👉 특징
 * - 완전히 독립된 UI 컴포넌트
 * - 부모에서 상태만 내려받아서 사용
 */

type Props = {
  open: boolean;
  onClose: () => void;

  checks: {
    rule1: boolean;
    rule2: boolean;
    rule3: boolean;
    rule4: boolean;
  };

  toggleCheck: (key: "rule1" | "rule2" | "rule3" | "rule4") => void;

  isAllChecked: boolean;
};

const StockGuideModal = ({
  open,
  onClose,
  checks,
  toggleCheck,
  isAllChecked,
}: Props) => {
  return (
    <InfoModal
      open={open}
      width="350px"
      title="💡 투자를 할 때 약속해요!"
      onClose={() => {
        // ❗ 전부 체크 안하면 닫기 막기
        if (!isAllChecked) return;

        onClose();
      }}
      buttonText={isAllChecked ? "알겠어요" : "모두 체크해야 계속할 수 있어요"}
    >
      <GuideContent>
        {/* ⚠️ 1번 */}
        <GuideItem $checked={checks.rule1} onClick={() => toggleCheck("rule1")}>
          <GuideText>⚠️ 주식은 오르기도 하고 내려가기도 해요</GuideText>
          <CheckIcon $checked={checks.rule1}>
            {checks.rule1 ? "✔" : ""}
          </CheckIcon>
        </GuideItem>

        {/* ⚠️ 2번 */}
        <GuideItem $checked={checks.rule2} onClick={() => toggleCheck("rule2")}>
          <GuideText>⚠️ 잃어도 괜찮은 돈으로 해야 해요</GuideText>
          <CheckIcon $checked={checks.rule2}>
            {checks.rule2 ? "✔" : ""}
          </CheckIcon>
        </GuideItem>

        {/* ⚠️ 3번 */}
        <GuideItem $checked={checks.rule3} onClick={() => toggleCheck("rule3")}>
          <GuideText>⚠️ 돈을 빌려서 투자하면 안 돼요</GuideText>
          <CheckIcon $checked={checks.rule3}>
            {checks.rule3 ? "✔" : ""}
          </CheckIcon>
        </GuideItem>

        {/* ⚠️ 4번 */}
        <GuideItem $checked={checks.rule4} onClick={() => toggleCheck("rule4")}>
          <GuideText>⚠️ 회사를 알아보고 투자하면 더 좋아요</GuideText>
          <CheckIcon $checked={checks.rule4}>
            {checks.rule4 ? "✔" : ""}
          </CheckIcon>
        </GuideItem>
      </GuideContent>
    </InfoModal>
  );
};

export default StockGuideModal;

/** =========================
 * 🎨 스타일 (컴포넌트 내부 유지)
 * ========================= */

const GuideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GuideItem = styled.div<{ $checked: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.surface : theme.colors.card};

  box-shadow: ${({ theme }) => theme.shadows.sm};

  cursor: pointer;
`;

const GuideText = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const CheckIcon = styled.div<{ $checked: boolean }>`
  width: 24px;
  height: 24px;

  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: bold;

  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : "transparent"};

  border: 2px solid ${({ theme }) => theme.colors.primary};

  color: white;
`;
