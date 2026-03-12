import styled from "styled-components";

type TabType = "NEW" | "HOT" | "hair" | "hat" | "top" | "accessory";

type Props = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

export const ShopTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <TabBar>
      {/* 윗줄 */}
      <TabGroup>
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
      </TabGroup>

      {/* 아랫줄 */}
      <TabGroup>
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
      </TabGroup>
    </TabBar>
  );
};

const TabBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;

  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 0;

  background: ${({ theme }) => theme.colors.background};
`;
const TabGroup = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
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
