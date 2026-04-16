import styled from "styled-components";

export type TabType = "ALL" | "NEW" | "COMMON" | "SPECIAL" | "LEGEND";

type Props = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

export const ShopTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <TabRow>
      <TabButton
        $active={activeTab === "ALL"}
        onClick={() => setActiveTab("ALL")}
      >
        전체
      </TabButton>

      <TabButton
        $active={activeTab === "NEW"}
        onClick={() => setActiveTab("NEW")}
      >
        NEW
      </TabButton>

      <TabButton
        $active={activeTab === "COMMON"}
        onClick={() => setActiveTab("COMMON")}
      >
        기본
      </TabButton>

      <TabButton
        $active={activeTab === "SPECIAL"}
        onClick={() => setActiveTab("SPECIAL")}
      >
        스페셜
      </TabButton>

      <TabButton
        $active={activeTab === "LEGEND"}
        onClick={() => setActiveTab("LEGEND")}
      >
        전설
      </TabButton>
    </TabRow>
  );
};

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};

  color: ${({ $active }) => ($active ? "#fff" : "inherit")};

  transition: 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;
