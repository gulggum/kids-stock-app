// 관리자 스킨 아이템 관리 페이지
// cardSkins 실제 데이터 연결

import styled from "styled-components";
import { cardSkins, type CardRarity } from "../../data/static/cardSkins";
import { useState } from "react";

type TabType = "ALL" | "COMMON" | "SPECIAL" | "LEGEND";

const RARITY_COLOR: Record<CardRarity, string> = {
  COMMON: "#2E8EDB",
  SPECIAL: "#9B59B6",
  LEGEND: "#F39C12",
};

const RARITY_LABEL: Record<CardRarity, string> = {
  COMMON: "일반",
  SPECIAL: "스페셜",
  LEGEND: "전설",
};

const AdminItems = () => {
  const [tab, setTab] = useState<TabType>("ALL");

  const filtered = cardSkins.filter((s) => {
    if (s.id === "basic") return false; // 기본 스킨 제외
    if (tab === "ALL") return true;
    return s.rarity === tab;
  });

  return (
    <Container>
      <HeaderRow>
        <SectionTitle>
          🎨 스킨 아이템 관리 ( 지금은 하드코딩으로 추가삭제하기 )
        </SectionTitle>
        <Count>{filtered.length}개</Count>
      </HeaderRow>

      {/* 탭 필터 */}
      <TabRow>
        {(["ALL", "COMMON", "SPECIAL", "LEGEND"] as TabType[]).map((t) => (
          <TabButton key={t} $active={tab === t} onClick={() => setTab(t)}>
            {t === "ALL" ? "전체" : RARITY_LABEL[t as CardRarity]}
          </TabButton>
        ))}
      </TabRow>

      {/* 스킨 목록 */}
      <SectionCard>
        {filtered.map((skin, idx) => (
          <ItemRow key={skin.id} $last={idx === filtered.length - 1}>
            {/* 스킨 미리보기 */}

            <SkinPreview
              style={{
                background: skin.gradient
                  ? skin.gradient
                  : `url(${skin.image}) center/cover`,
              }}
            />

            <ItemText>
              <ItemLabel>{skin.name}</ItemLabel>
              <ItemDesc>{skin.price} 코인</ItemDesc>
            </ItemText>

            {/* 등급 뱃지 */}
            <RarityBadge
              style={{
                background: `${RARITY_COLOR[skin.rarity]}18`,
                color: RARITY_COLOR[skin.rarity],
              }}
            >
              {RARITY_LABEL[skin.rarity]}
            </RarityBadge>

            {/* 레벨 제한 */}
            {skin.unlockLevel && <LockBadge>Lv.{skin.unlockLevel}</LockBadge>}
          </ItemRow>
        ))}
      </SectionCard>
    </Container>
  );
};

export default AdminItems;

/* ================= 스타일 ================= */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 4px;
`;

const SectionTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

const Count = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const TabRow = styled.div`
  display: flex;
  gap: 6px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px;
  border-radius: 999px;
  border: none;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const ItemRow = styled.div<{ $last: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: ${({ $last, theme }) =>
    $last ? "none" : `1px solid ${theme.colors.background}`};
`;

const SkinPreview = styled.div`
  width: 48px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const ItemText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ItemDesc = styled.p`
  font-size: 12px;
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const RarityBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
`;

const LockBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
`;
