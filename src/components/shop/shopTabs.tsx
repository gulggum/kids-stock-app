import styled from "styled-components";

type TabType = "NEW" | "HOT" | "hair" | "hat" | "top" | "accessory";

type Props = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

export const ShopTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <TabBar>
      <TabButton
        $active={activeTab === "NEW"}
        onClick={() => setActiveTab("NEW")}
      >
        NEW
      </TabButton>

      <TabButton
        $active={activeTab === "HOT"}
        onClick={() => setActiveTab("HOT")}
      >
        HOT
      </TabButton>

      <TabButton
        $active={activeTab === "hair"}
        onClick={() => setActiveTab("hair")}
      >
        💇 머리
      </TabButton>

      <TabButton
        $active={activeTab === "hat"}
        onClick={() => setActiveTab("hat")}
      >
        🧢 모자
      </TabButton>

      <TabButton
        $active={activeTab === "top"}
        onClick={() => setActiveTab("top")}
      >
        👕 옷
      </TabButton>

      <TabButton
        $active={activeTab === "accessory"}
        onClick={() => setActiveTab("accessory")}
      >
        ✨ 악세
      </TabButton>
    </TabBar>
  );
};

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  overflow-x: auto;
  padding: 6px 0;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};

  color: ${({ $active }) => ($active ? "white" : "inherit")};

  white-space: nowrap;
`;
