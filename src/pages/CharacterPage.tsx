import styled, { keyframes } from "styled-components";
import { useCoin } from "../context/WalletContext/CoinContext";
import { useToast } from "../context/UIContext/ToastContext";
import { useItem } from "../context/UserContext/ItemContext";
import { useEffect, useRef, useState } from "react";
import { useCharacter } from "../context/UserContext/CharacterContext";
import { LEVEL_RULES } from "../data/rules/levelTitles";
import { useAchievement } from "../context/AchievementContext/AchievementContext";
import { ACHIEVEMENTS } from "../data/rules/achievementRules";
import { cardSkins } from "../data/static/cardSkins";

const CharacterPage = () => {
  const { createToast } = useToast();
  const { coins } = useCoin();
  const { character, currentTitle } = useCharacter();
  const { achieved } = useAchievement();
  const { ownedSkins, selectedSkin, selectSkin } = useItem();

  const [activeTab, setActiveTab] = useState<
    "ALL" | "COMMON" | "SPECIAL" | "LEGEND"
  >("ALL");

  const [levelUp, setLevelUp] = useState(false);
  const prevLevel = useRef(character.level); //이전 레벨 기억용(리렌더링 방지)

  // -----------------------------
  // 🎯 현재 선택 카드
  // -----------------------------
  const currentSkin = cardSkins.find((s) => s.id === selectedSkin);

  // -----------------------------
  // 📊 레벨 계산
  // -----------------------------

  // 현재 레벨 룰
  const currentLevelRule = LEVEL_RULES.find(
    (rule) => rule.level === character.level,
  );

  // 다음 레벨 룰
  const nextLevelRule = LEVEL_RULES.find(
    (rule) => rule.level === character.level + 1,
  );

  // 현재 레벨 시작 exp
  const currentRequiredExp = currentLevelRule?.requiredExp ?? 0;

  // 다음 레벨 exp
  const nextRequiredExp = nextLevelRule?.requiredExp ?? currentRequiredExp;

  // 현재 레벨 구간 내 exp
  const currentLevelExp = character.exp - currentRequiredExp;

  // 레벨 구간 필요 exp
  const neededExp = nextRequiredExp - currentRequiredExp;

  // 진행률 %
  const progressPercent = nextLevelRule
    ? (currentLevelExp / neededExp) * 100
    : 100;

  // -----------------------------
  // 🔼 레벨업 애니메이션
  // -----------------------------
  useEffect(() => {
    if (character.level > prevLevel.current) {
      setLevelUp(true);
      prevLevel.current = character.level;

      //애니메이션 종료
      setTimeout(() => setLevelUp(false), 800);
    }
  }, [character.level]);

  //스킨필터함수
  const filteredSkins = ownedSkins
    .map((id) => cardSkins.find((s) => s.id === id))
    .filter((skin) => {
      if (!skin) return false;
      if (activeTab === "ALL") return true;
      return skin.rarity === activeTab;
    });

  return (
    <Wrapper>
      {/* =========================
          👦 캐릭터 영역
      ========================= */}
      <CharacterCard>
        <Name $level={character.level}>{currentTitle}</Name>

        <CharacterArea>
          <Avatar $levelUp={levelUp}>🧒</Avatar>
        </CharacterArea>

        {/* 📊 레벨 */}
        <Level>
          <LevelText>⭐ Lv.{character.level}</LevelText>

          <ExpBar>
            <ExpFill $value={progressPercent} />
          </ExpBar>

          {nextLevelRule ? (
            <ExpText>
              {currentLevelExp} / {neededExp} EXP
              {"  "}
              (다음 레벨까지 {nextRequiredExp - character.exp} EXP)
            </ExpText>
          ) : (
            <ExpText>최고 레벨 🎉</ExpText>
          )}
        </Level>

        {/* =========================
            🪙 상태 카드
        ========================= */}
        <StatusCard>
          <StatusHeader>
            <span>🪙 보유 코인</span>
            <strong>{coins}</strong>
          </StatusHeader>

          <Divider />

          <BadgeSection>
            {achieved.length === 0 ? (
              <EmptyBadge>아직 업적이 없어요 🐣</EmptyBadge>
            ) : (
              achieved.map((id: string) => {
                const a = ACHIEVEMENTS.find((x) => x.id === id);
                if (!a) return null;

                return (
                  <Badge key={id}>
                    <span>{a.badge.emoji}</span>
                    <small>{a.badge.title}</small>
                  </Badge>
                );
              })
            )}
          </BadgeSection>
        </StatusCard>
      </CharacterCard>

      {/* =========================
          💳 내 투자 카드
      ========================= */}
      <PortfolioCard>
        <CardPreviewBig $skin={currentSkin} />

        <CardContent>
          <CardTitle>내 투자 카드 💳</CardTitle>

          <CardInfo>
            <div>총 자산</div>
            <strong>{"13,501"}원</strong>
          </CardInfo>

          <CardSub>오늘도 투자 공부 중 📈</CardSub>
        </CardContent>
      </PortfolioCard>

      {/* =========================
          🎴 카드 선택 영역
      ========================= */}
      <ItemSection>
        <SectionTitle>내 카드</SectionTitle>

        {/* 탭 */}
        <TabRow>
          {["ALL", "COMMON", "SPECIAL", "LEGEND"].map((tab) => (
            <TabButton
              key={tab}
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === "ALL"
                ? "전체"
                : tab === "COMMON"
                  ? "기본"
                  : tab === "SPECIAL"
                    ? "스페셜"
                    : "레전드"}
            </TabButton>
          ))}
        </TabRow>

        {/* 카드 리스트 */}
        <HorizontalList>
          {filteredSkins.map((skin) => {
            if (!skin) return null;

            const isSelected = selectedSkin === skin.id;
            const usable = character.level >= (skin.unlockLevel ?? 0);

            return (
              <Item
                key={skin.id}
                $selected={isSelected}
                $locked={!usable}
                onClick={() => {
                  if (!usable) {
                    createToast(`Lv.${skin.unlockLevel} 이상부터 착용 가능 🔒`);
                    return;
                  }

                  selectSkin(skin.id);
                  createToast("카드 변경 완료 🎉");
                }}
              >
                <CardPreview $skin={skin} />

                <ItemName>{skin.name}</ItemName>

                <ItemStatus>
                  {!usable
                    ? `🔒 Lv.${skin.unlockLevel}`
                    : isSelected
                      ? "⭐ 사용중"
                      : "적용하기"}
                </ItemStatus>
              </Item>
            );
          })}
        </HorizontalList>
      </ItemSection>
    </Wrapper>
  );
};
export default CharacterPage;

/////////////////////////////////////////////////////////
// 🎨 스타일
/////////////////////////////////////////////////////////

const levelUpAnim = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CharacterCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharacterArea = styled.div`
  margin: 20px 0;
  padding: 24px 0;
  width: 100%;
  display: flex;
  justify-content: center;

  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.accentBlue},
    ${({ theme }) => theme.colors.background}
  );
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const Avatar = styled.div<{ $levelUp?: boolean }>`
  font-size: 72px;
  animation: ${({ $levelUp }) => ($levelUp ? levelUpAnim : "none")} 0.6s ease;
`;

const Name = styled.div<{ $level: number }>`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  color: #fff;

  background: ${({ $level, theme }) =>
    $level >= 10
      ? "linear-gradient(135deg, gold, orange)"
      : $level >= 5
        ? `linear-gradient(135deg, ${theme.colors.accentPurple}, ${theme.colors.primary})`
        : theme.colors.primary};
`;

const Level = styled.div`
  width: 100%;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.card};
`;

const LevelText = styled.div`
  font-weight: 800;
`;

const ExpBar = styled.div`
  height: 10px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
`;

const ExpFill = styled.div<{ $value: number }>`
  height: 100%;
  width: ${({ $value }) => `${$value}%`};
  background: ${({ theme }) => theme.colors.primary};
`;

const ExpText = styled.div`
  font-size: 12px;
  text-align: right;
`;

const StatusCard = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
`;

const Divider = styled.div`
  height: 1px;
  margin: 10px 0;
  background: ${({ theme }) => theme.colors.border};
`;

const BadgeSection = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Badge = styled.div`
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 12px;
`;

const EmptyBadge = styled.div`
  font-size: 12px;
`;

const PortfolioCard = styled.div`
  position: relative;
  height: 160px;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const CardPreviewBig = styled.div<{ $skin: any }>`
  position: absolute;
  inset: 0;
  background: ${({ $skin }) =>
    $skin?.gradient ? $skin.gradient : `url(${$skin?.image}) center/cover`};
  filter: brightness(0.7);
`;

const CardContent = styled.div`
  position: relative;
  padding: 16px;
  color: #fff;
`;

const CardTitle = styled.div`
  font-weight: 700;
`;

const CardInfo = styled.div`
  strong {
    font-size: 20px;
  }
`;

const CardSub = styled.div`
  font-size: 12px;
`;

const ItemSection = styled.div`
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  flex-direction: column;
  gap: 16px; /* 🔥 탭이랑 리스트 간격 */
`;

const SectionTitle = styled.div`
  font-weight: 800;
  margin-bottom: 4px;
`;

const TabRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
  cursor: pointer;
  font-weight: 500;
`;

const HorizontalList = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 10px 0px;
  padding-left: 10px;
  padding-bottom: 10px;
`;

const Item = styled.div<{ $selected?: boolean; $locked?: boolean }>`
  min-width: 140px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.card};

  cursor: pointer;
  border: ${({ $selected, theme }) =>
    $selected ? `2px solid ${theme.colors.primary}` : "none"};
  /* 🔥 선택 glow */
  ${({ $selected }) =>
    $selected &&
    `
    box-shadow:
      0 0 0 2px rgba(80, 120, 255, 0.3),
      0 8px 20px rgba(80, 120, 255, 0.35);
    transform: translateY(-2px) scale(1.03);
  `}

  ${({ $locked }) =>
    $locked &&
    `
    opacity: 0.6;
    filter: grayscale(0.8);
  `}
   &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardPreview = styled.div<{ $skin: any }>`
  width: 100%;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.sm};

  background: ${({ $skin }) =>
    $skin?.gradient ? $skin.gradient : `url(${$skin?.image}) center/cover`};

  position: relative;
  overflow: hidden;

  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ItemName = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const ItemStatus = styled.div`
  font-size: 12px;
`;
