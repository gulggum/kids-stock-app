import styled from "styled-components";

/**
 * 🗂 카드 필터 탭
 */
type Props = {
  activeTab: string;
  onChange: (tab: string) => void;
};

const tabs = ["HOUSE", "COMMON", "SPECIAL", "LEGEND"];

const SkinTabs = ({ activeTab, onChange }: Props) => {
  return (
    <Wrapper>
      {tabs.map((tab) => (
        <Tab
          key={tab}
          $active={activeTab === tab}
          onClick={() => onChange(tab)}
        >
          {tab === "HOUSE"
            ? "나의 집"
            : tab === "COMMON"
              ? "기본"
              : tab === "SPECIAL"
                ? "스페셜"
                : "레전드"}
        </Tab>
      ))}
    </Wrapper>
  );
};

export default SkinTabs;

/* 스타일 */

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background};

  color: ${({ $active }) => ($active ? "#fff" : "inherit")};

  cursor: pointer;
  font-weight: 600;
`;
