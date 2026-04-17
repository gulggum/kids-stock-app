import { useState } from "react";
import styled from "styled-components";
import SkinTabs from "./SkinTabs";
import SkinItem from "./SkinItem";
import { useHouse } from "../../hooks/useHouse";
import { HOUSES } from "../../data/static/house";
import HouseItem from "./HouseItem";

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

  // 집 훅 연결
  const { isOwned, equippedHouseId, equipHouse } = useHouse();

  const filtered = skins.filter((skin) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "HOUSE") return false; // 카드스킨 목록엔 집 제외
    return skin.rarity === activeTab;
  });

  return (
    <Wrapper>
      <Title>내 카드</Title>

      <SkinTabs activeTab={activeTab} onChange={setActiveTab} />

      <List>
        {/* 집 탭 */}

        {activeTab === "HOUSE" && (
          <>
            {HOUSES.filter((h) => isOwned(h.id)).length === 0 ? (
              <Empty>아직 보유한 집이 없어요 🏠</Empty>
            ) : (
              HOUSES.filter((h) => isOwned(h.id)).map((house) => (
                <HouseItem
                  key={house.id}
                  house={house}
                  isEquipped={equippedHouseId === house.id}
                  locked={characterLevel < house.requiredLevel}
                  onClick={() => equipHouse(house.id)}
                />
              ))
            )}
          </>
        )}

        {/* 카드스킨 탭 */}
        {activeTab !== "HOUSE" && (
          <>
            {filtered.length === 0 ? (
              <Empty>아직 보유한 카드가 없어요 🎴</Empty>
            ) : (
              filtered.map((skin) => {
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
              })
            )}
          </>
        )}
      </List>
    </Wrapper>
  );
};

export default SkinSection;

/* 스타일 */

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;

  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 300px;
`;

const Title = styled.div`
  font-weight: 800;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;
`;

const List = styled.div`
  display: flex;
  height: 200px;
  gap: 12px;
  overflow-x: auto;
  padding: 15px;

  background: ${({ theme }) => theme.colors.background};

  border-radius: ${({ theme }) => theme.radius.md};

  box-shadow: 0 6px 18px rgba(31, 58, 95, 0.08);

  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Empty = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  padding: 20px 0;
  text-align: center;
  width: 100%;
  height: 200px;
`;
