import { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { HOUSES } from "../data/static/house";
import { ACHIEVEMENTS } from "../data/rules/achievementRules";
import { supabase } from "../utils/supabase";
import { useUser } from "../context/UserContext";
import type { PublicUser } from "../types/UserType";
import avatarSprite from "../assets/avatars/avatarSprite.png";

// ─────────────────────────────────────────
// 📌 Props
// ─────────────────────────────────────────
type Props = {
  users: PublicUser[];
  myUserId: string;
};

const VillagePage = ({ users, myUserId }: Props) => {
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  // 내 현재 위치 (로컬 상태 - DB랑 동기화)
  const myUser = users.find((u) => u.id === myUserId);
  const [myPos, setMyPos] = useState<{ x: number; y: number } | null>(
    myUser?.villageX != null
      ? { x: myUser.villageX!, y: myUser.villageY! }
      : null,
  );
  useEffect(() => {
    if (myUser?.villageX != null && myUser?.villageY != null) {
      setMyPos({
        x: myUser.villageX,
        y: myUser.villageY,
      });
    }
  }, [myUser?.villageX, myUser?.villageY]);

  // ─────────────────────────────────────────
  // 🏘 마을에 입주한 다른 유저만
  // ─────────────────────────────────────────
  const villageUsers = users.filter(
    (u) => u.id !== myUserId && u.villageX != null && u.villageY != null,
  );

  // ─────────────────────────────────────────
  // 🗺 마을 클릭 → 내 집 위치 저장
  // ─────────────────────────────────────────
  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMoving) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 범위 제한 (땅 밖으로 못 나가게)
    const clampedX = Math.min(Math.max(x, 5), 90);
    const clampedY = Math.min(Math.max(y, 10), 78);

    setMyPos({ x: clampedX, y: clampedY });
    setIsMoving(false);

    // Supabase 저장
    await supabase
      .from("profiles")
      .update({ village_x: clampedX, village_y: clampedY })
      .eq("id", myUserId);
  };

  // ─────────────────────────────────────────
  // 🏠 내 집 뱃지
  // ─────────────────────────────────────────
  const myHouse =
    HOUSES.find((h) => h.id === (user.equippedHouseId ?? "house_basic")) ??
    HOUSES[0];

  const residentCount = villageUsers.length + (myPos ? 1 : 0);

  return (
    <Wrapper>
      {/* 상단 버튼 + 힌트 */}
      <TopBar>
        <MoveButton $active={isMoving} onClick={() => setIsMoving((v) => !v)}>
          {isMoving
            ? "📍 클릭해서 집 놓기"
            : myPos
              ? "🚚 이사하기"
              : "🏠 마을에 입주하기"}
        </MoveButton>
        <HintText>
          {isMoving
            ? "원하는 위치를 클릭하세요!"
            : residentCount > 0
              ? `${residentCount}명이 마을에 살고 있어요 🏘️`
              : "아직 아무도 없어요. 첫 주민이 되어보세요!"}
        </HintText>
      </TopBar>

      {/* 마을 맵 */}
      <Village $isMoving={isMoving} onClick={handleMapClick}>
        {/* 구름 */}
        <Cloud
          style={{ width: "80px", height: "28px", top: "8%", left: "10%" }}
        />
        <Cloud
          style={{ width: "50px", height: "18px", top: "5%", left: "17%" }}
        />
        <Cloud
          style={{ width: "100px", height: "32px", top: "12%", right: "15%" }}
        />
        <Cloud
          style={{ width: "60px", height: "20px", top: "9%", right: "24%" }}
        />
        <Cloud
          style={{ width: "70px", height: "24px", top: "20%", left: "44%" }}
        />

        {/* 땅 */}
        <Ground />
        <Road />
        <RoadLine />

        {/* 나무 */}
        <Tree style={{ bottom: "11%", left: "2%" }}>
          <TreeTop />
          <TreeTrunk />
        </Tree>
        <Tree style={{ bottom: "11%", left: "4.5%" }}>
          <TreeTop $small />
          <TreeTrunk $small />
        </Tree>
        <Tree style={{ bottom: "11%", right: "2%" }}>
          <TreeTop />
          <TreeTrunk />
        </Tree>
        <Tree style={{ bottom: "11%", right: "5%" }}>
          <TreeTop $small />
          <TreeTrunk $small />
        </Tree>
        <Tree style={{ bottom: "28%", left: "48%" }}>
          <TreeTop $dark />
          <TreeTrunk />
        </Tree>
        <Tree style={{ bottom: "50%", right: "8%" }}>
          <TreeTop $small $dark />
          <TreeTrunk $small />
        </Tree>
        <Tree style={{ bottom: "48%", left: "8%" }}>
          <TreeTop $dark />
          <TreeTrunk />
        </Tree>

        {/* 다른 유저 집들 */}
        {villageUsers.map((u, idx) => {
          const house =
            HOUSES.find((h) => h.id === (u.equippedHouseId ?? "house_basic")) ??
            HOUSES[0];
          return (
            <HousePin
              key={u.id}
              style={{ left: `${u.villageX}%`, top: `${u.villageY}%` }}
              $delay={`${(idx * 0.3) % 1.5}s`}
              $isMe={false}
              onClick={(e) => {
                e.stopPropagation();
                if (!isMoving) setSelectedUser(u);
              }}
            >
              <HouseBadge dangerouslySetInnerHTML={{ __html: house.badge }} />
              <PinName>{u.nickname}</PinName>
            </HousePin>
          );
        })}

        {/* 내 집 */}
        {myPos && (
          <HousePin
            style={{ left: `${myPos.x}%`, top: `${myPos.y}%` }}
            $delay="0s"
            $isMe={true}
            onClick={(e) => e.stopPropagation()}
          >
            <HouseBadge dangerouslySetInnerHTML={{ __html: myHouse.badge }} />
            <MeTag>나</MeTag>
            <PinName>{user.nickname}</PinName>
          </HousePin>
        )}

        {/* 이사하기 모드 힌트 오버레이 */}
        {isMoving && <MovingOverlay />}

        {/* 완전 비어있을 때 */}
        {residentCount === 0 && !isMoving && (
          <EmptyHint>
            아직 아무도 없어요 🏜️
            <br />첫 번째 주민이 되어보세요!
          </EmptyHint>
        )}
      </Village>

      {/* 유저 카드 모달 */}
      {selectedUser && (
        <Overlay onClick={() => setSelectedUser(null)}>
          <UserCard onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={() => setSelectedUser(null)}>✕</CloseBtn>

            {/* 집 뱃지 */}
            <CardHouseBadge
              dangerouslySetInnerHTML={{
                __html:
                  HOUSES.find(
                    (h) =>
                      h.id === (selectedUser.equippedHouseId ?? "house_basic"),
                  )?.badge ?? HOUSES[0].badge,
              }}
            />

            {/* 아바타 */}
            <AvatarWrap>
              {selectedUser.profileAvatar ? (
                <AvatarSprite
                  $x={selectedUser.profileAvatar.x}
                  $y={selectedUser.profileAvatar.y}
                />
              ) : (
                <AvatarEmoji>{selectedUser.emoji}</AvatarEmoji>
              )}
            </AvatarWrap>

            <CardName>{selectedUser.nickname}</CardName>
            <CardLevel>Lv. {selectedUser.level}</CardLevel>

            <CardHouseName>
              {HOUSES.find(
                (h) => h.id === (selectedUser.equippedHouseId ?? "house_basic"),
              )?.name ?? "기본 지붕집"}{" "}
              거주중
            </CardHouseName>

            {selectedUser.badges.length > 0 && (
              <BadgeRow>
                {selectedUser.badges.slice(0, 4).map((badgeId) => {
                  const achievement = ACHIEVEMENTS.find(
                    (a) => a.id === badgeId,
                  );
                  if (!achievement) return null;
                  return (
                    <BadgeChip key={badgeId}>
                      {achievement.badge.emoji}
                    </BadgeChip>
                  );
                })}
                {selectedUser.badges.length > 4 && (
                  <BadgeChip>+{selectedUser.badges.length - 4}</BadgeChip>
                )}
              </BadgeRow>
            )}

            <StatusBubble>{selectedUser.status}</StatusBubble>
          </UserCard>
        </Overlay>
      )}
    </Wrapper>
  );
};

export default VillagePage;

// ─────────────────────────────────────────
// 🎨 애니메이션
// ─────────────────────────────────────────
const float = keyframes`
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50%       { transform: translate(-50%, -50%) translateY(-8px); }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.15; }
  50%       { opacity: 0.35; }
`;

// ─────────────────────────────────────────
// 🎨 스타일
// ─────────────────────────────────────────
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MoveButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.card};
  color: ${({ $active }) => ($active ? "white" : "inherit")};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover {
    transform: scale(1.03);
  }
`;

const HintText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Village = styled.div<{ $isMoving: boolean }>`
  position: relative;
  width: 100%;
  height: 460px;
  background: linear-gradient(180deg, #b8e8f8 0%, #d4f0e8 50%, #c8e8a0 100%);
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  cursor: ${({ $isMoving }) => ($isMoving ? "crosshair" : "default")};
`;

const Cloud = styled.div`
  position: absolute;
  background: white;
  border-radius: 50px;
  opacity: 0.9;
`;

const Ground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: #7cb342;
  border-radius: 60% 60% 0 0 / 30px 30px 0 0;
`;

const Road = styled.div`
  position: absolute;
  bottom: 68px;
  left: 0;
  right: 0;
  height: 22px;
  background: #c8b89a;
`;

const RoadLine = styled.div`
  position: absolute;
  bottom: 77px;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.6) 0px,
    rgba(255, 255, 255, 0.6) 20px,
    transparent 20px,
    transparent 40px
  );
`;

const Tree = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TreeTop = styled.div<{ $small?: boolean; $dark?: boolean }>`
  width: ${({ $small }) => ($small ? "22px" : "28px")};
  height: ${({ $small }) => ($small ? "22px" : "28px")};
  background: ${({ $dark }) => ($dark ? "#388E3C" : "#4CAF50")};
  border-radius: 50% 50% 40% 40%;
`;

const TreeTrunk = styled.div<{ $small?: boolean }>`
  width: ${({ $small }) => ($small ? "6px" : "8px")};
  height: ${({ $small }) => ($small ? "10px" : "12px")};
  background: #795548;
`;

const HousePin = styled.div<{ $delay: string; $isMe: boolean }>`
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ $isMe }) => ($isMe ? "default" : "pointer")};
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  z-index: 2;

  ${({ $isMe }) =>
    $isMe &&
    css`
      filter: drop-shadow(0 0 8px rgba(80, 120, 255, 0.8));
      z-index: 5;
    `}

  &:not([style*="cursor: default"]):hover {
    z-index: 10;
  }

  &:hover > div:last-child {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const HouseBadge = styled.div`
  width: 56px;
  height: 56px;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

const MeTag = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const PinName = styled.div`
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  white-space: nowrap;
  font-size: 11px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 2px 8px;
  border-radius: 999px;
  opacity: 0;
  transition: all 0.2s;
  pointer-events: none;
`;

const MovingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(80, 120, 255, 0.15);
  animation: ${pulse} 1.2s ease-in-out infinite;
  pointer-events: none;
  z-index: 20;
  border: 2px dashed rgba(80, 120, 255, 0.4);
  border-radius: inherit;
`;

const EmptyHint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.3);
  line-height: 1.8;
  pointer-events: none;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px 16px 16px;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: ${popIn} 0.25s ease;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1;
`;

const CardHouseBadge = styled.div`
  width: 72px;
  height: 72px;
  margin-bottom: 4px;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

const AvatarWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const AvatarSprite = styled.div<{ $x: number; $y: number }>`
  width: 100%;
  height: 100%;
  background-image: url(${avatarSprite});
  background-size: 500% 300%;
  background-position: ${({ $x, $y }) =>
    `${($x / 3.8999) * 100}% ${($y / 2) * 100}%`};
`;

const AvatarEmoji = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const CardName = styled.div`
  font-size: 15px;
  font-weight: 800;
`;

const CardLevel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const CardHouseName = styled.div`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.muted};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2px;
`;

const BadgeChip = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const StatusBubble = styled.div`
  width: 100%;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 8px 12px;
  border-radius: 12px;
  margin-top: 4px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.colors.background};
  }
`;
