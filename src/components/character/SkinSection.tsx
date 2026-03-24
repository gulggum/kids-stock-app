import { useState } from "react";
import styled from "styled-components";
import SkinTabs from "./SkinTabs";
import SkinItem from "./SkinItem";

/**
 * 🎴 카드 스킨 전체 영역
 */
type Props = {
  skins: any[];
  selectedSkin: string;
  characterLevel: number;
  onSelect: (id: string) => void;
};

const SkinSection = ({
  skins,
  selectedSkin,
  characterLevel,
  onSelect,
}: Props) => {
  const [activeTab, setActiveTab] = useState("ALL");

  const filtered = skins.filter((skin) => {
    if (activeTab === "ALL") return true;
    return skin.rarity === activeTab;
  });

  return (
    <Wrapper>
      <Title>내 카드</Title>

      <SkinTabs activeTab={activeTab} onChange={setActiveTab} />

      <List>
        {filtered.map((skin) => {
          const isSelected = selectedSkin === skin.id;
          const locked = characterLevel < (skin.unlockLevel ?? 0);

          return (
            <SkinItem
              key={skin.id}
              skin={skin}
              isSelected={isSelected}
              locked={locked}
              onClick={() => {
                if (locked) return;
                onSelect(skin.id);
              }}
            />
          );
        })}
      </List>
    </Wrapper>
  );
};

export default SkinSection;

/* 스타일 */

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;

  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.div`
  font-weight: 800;
`;

const List = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;
