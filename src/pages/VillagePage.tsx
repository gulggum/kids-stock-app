import { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { HOUSES } from "../data/static/house";
import { ACHIEVEMENTS } from "../data/rules/achievementRules";
import { supabase } from "../utils/supabase";
import { useUser } from "../context/UserContext";
import type { PublicUser } from "../types/UserType";
import avatarSprite from "../assets/avatars/avatarSprite.png";
import { useHouse } from "../hooks/useHouse";
import villageBg from "../assets/images/houses/village_bg.jpg";

// ─────────────────────────────────────────
// 📌 맵 실제 크기 (뷰포트보다 크게 - 드래그로 탐험)
// ─────────────────────────────────────────
const MAP_WIDTH = 1019;
const MAP_HEIGHT = 1365;

type Props = {
  users: PublicUser[];
  myUserId: string;
};

const VillagePage = ({ users, myUserId }: Props) => {
  const { user } = useUser();
  const { isOwned } = useHouse();
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  // 줌 상태 추가
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(0.3);

  const MAX_SCALE = 2;

  // ─────────────────────────────────────────
  // 🗺 드래그 스크롤 (마우스 + 터치)
  // ─────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMoving) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current?.scrollLeft ?? 0,
      scrollTop: containerRef.current?.scrollTop ?? 0,
    };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    containerRef.current.scrollLeft =
      dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
    containerRef.current.scrollTop =
      dragStart.current.scrollTop - (e.clientY - dragStart.current.y);
  }, []);

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const touchStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMoving) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      scrollLeft: containerRef.current?.scrollLeft ?? 0,
      scrollTop: containerRef.current?.scrollTop ?? 0,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || isMoving) return;
    containerRef.current.scrollLeft =
      touchStart.current.scrollLeft -
      (e.touches[0].clientX - touchStart.current.x);
    containerRef.current.scrollTop =
      touchStart.current.scrollTop -
      (e.touches[0].clientY - touchStart.current.y);
  };

  // ─────────────────────────────────────────
  // 📌 내 집 위치 (DB에서 불러온 값으로 초기화)
  // ─────────────────────────────────────────
  const myUser = users.find((u) => u.id === myUserId);
  const [myPos, setMyPos] = useState<{ x: number; y: number } | null>(
    myUser?.villageX != null
      ? { x: myUser.villageX!, y: myUser.villageY! }
      : null,
  );
  //데이터 동기화목적
  useEffect(() => {
    if (myUser?.villageX != null && myUser?.villageY != null) {
      setMyPos({ x: myUser.villageX, y: myUser.villageY });
    }
  }, [myUser?.villageX, myUser?.villageY]);

  // 입주한 다른 유저만
  const villageUsers = users.filter(
    (u) => u.id !== myUserId && u.villageX != null && u.villageY != null,
  );

  // ─────────────────────────────────────────
  // 🗺 맵 클릭 → 내 집 위치 저장 (px 절대좌표)
  // ─────────────────────────────────────────
  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMoving) return;
    if (isDragging.current) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left) / scale; // 👈 scale로 나누기
    const y = (e.clientY - rect.top) / scale;

    const clampedX = Math.min(Math.max(x, 40), MAP_WIDTH - 40);
    const clampedY = Math.min(Math.max(y, 40), MAP_HEIGHT - 40);

    setMyPos({ x: clampedX, y: clampedY });
    setIsMoving(false);

    await supabase
      .from("profiles")
      .update({ village_x: clampedX, village_y: clampedY })
      .eq("id", myUserId);
  };

  const myHouse =
    HOUSES.find((h) => h.id === (user.equippedHouseId ?? "house_basic")) ??
    HOUSES[0];

  const residentCount = villageUsers.length + (myPos ? 1 : 0);

  // ─────────────────────────────────────────
  // 마우스 휠 줌(zoom)
  // ─────────────────────────────────────────
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, minScale), MAX_SCALE));
  };

  // 핀치 줌 (모바일)
  const lastPinchDistance = useRef<number | null>(null);

  const handleTouchStartZoom = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
    } else {
      handleTouchStart(e); // 기존 드래그
    }
  };

  const handleTouchMoveZoom = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDistance.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const delta = (distance - lastPinchDistance.current) * 0.005;
      setScale((prev) => Math.min(Math.max(prev + delta, minScale), MAX_SCALE));
      lastPinchDistance.current = distance;
    } else {
      handleTouchMove(e); // 기존 드래그
    }
  };
  // 마운트 시 맵 중앙으로 스크롤
  useEffect(() => {
    const initMap = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;

      const fitScaleX = container.clientWidth / MAP_WIDTH;
      const fitScaleY = container.clientHeight / MAP_HEIGHT;
      const fitScale = Math.max(fitScaleX, fitScaleY);

      setScale(fitScale);
      setMinScale(fitScale);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const centerX = (MAP_WIDTH * fitScale - container.clientWidth) / 2;
          const centerY = (MAP_HEIGHT * fitScale - container.clientHeight) / 2;
          container.scrollLeft = Math.max(centerX, 0);
          container.scrollTop = Math.max(centerY, 0);
        });
      });
    };

    initMap(); // 마운트 시 실행

    //  화면 크기 바뀔 때도 실행
    window.addEventListener("resize", initMap);
    return () => window.removeEventListener("resize", initMap);
  }, []);
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
        <GuideButton onClick={() => setShowGuide(true)}>🏡 집 안내</GuideButton>
        <HintText>
          {isMoving
            ? "원하는 위치를 클릭하세요!"
            : residentCount > 0
              ? `${residentCount}명이 마을에 살고 있어요 🏘️`
              : "아직 아무도 없어요. 첫 주민이 되어보세요!"}
        </HintText>
      </TopBar>

      {showGuide && (
        <Overlay onClick={() => setShowGuide(false)}>
          <GuideCard onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={() => setShowGuide(false)}>✕</CloseBtn>
            <GuideTitle>🏡 집 업그레이드 안내</GuideTitle>

            {HOUSES.map((house) => {
              const unlocked = user.level >= house.requiredLevel;
              const owned = isOwned(house.id);

              return (
                <GuideRow key={house.id} $unlocked={unlocked}>
                  <GuideBadge>
                    <img src={house.badge} alt={house.name} />
                  </GuideBadge>
                  <GuideInfo>
                    <GuideName $unlocked={unlocked}>{house.name}</GuideName>
                    <GuideDesc>{house.description}</GuideDesc>
                    <GuideMeta>
                      Lv.{house.requiredLevel} 이상 ·{" "}
                      {house.price === 0 ? "무료" : `${house.price} 코인`}
                    </GuideMeta>
                  </GuideInfo>

                  {/* 3단계로 구분 */}
                  {owned ? (
                    <UnlockTag>🏠 보유중</UnlockTag>
                  ) : unlocked ? (
                    <UnlockTag>✅ 구매 가능!</UnlockTag>
                  ) : (
                    <LockTag>🔒 Lv.{house.requiredLevel}</LockTag>
                  )}
                </GuideRow>
              );
            })}
          </GuideCard>
        </Overlay>
      )}
      {/* 드래그 스크롤 컨테이너 */}
      <MapContainer
        ref={containerRef}
        $isMoving={isMoving}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStartZoom}
        onTouchMove={handleTouchMoveZoom}
      >
        <MapHint>
          <span>🖐 드래그</span>
          <span>🔍 핀치/휠 줌</span>
        </MapHint>
        <MapInner $isMoving={isMoving} $scale={scale} onClick={handleMapClick}>
          {/* 잔디 배경 */}
          <GrassBase />

          {/* 다른 유저 집들 */}
          {villageUsers.map((u, idx) => {
            const house =
              HOUSES.find(
                (h) => h.id === (u.equippedHouseId ?? "house_basic"),
              ) ?? HOUSES[0];
            return (
              <HousePin
                key={u.id}
                style={{
                  left: `${(u.villageX ?? 0) * scale}px`,
                  top: `${(u.villageY ?? 0) * scale}px`,
                }}
                $delay={`${(idx * 0.3) % 1.5}s`}
                $isMe={false}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isMoving) setSelectedUser(u);
                }}
              >
                <HouseBadge $scale={scale}>
                  <img src={house.badge} alt={house.name} />
                </HouseBadge>
                <PinName>{u.nickname}</PinName>
              </HousePin>
            );
          })}

          {/* 내 집 */}
          {myPos && (
            <HousePin
              style={{
                left: `${myPos.x * scale}px`,
                top: `${myPos.y * scale}px`,
              }}
              $delay="0s"
              $isMe={true}
              onClick={(e) => e.stopPropagation()}
            >
              <HouseBadge $scale={scale}>
                <img src={myHouse.badge} alt={myHouse.name} />
              </HouseBadge>
              <MeTag>나</MeTag>
              <PinName>{user.nickname}</PinName>
            </HousePin>
          )}

          {isMoving && <MovingOverlay />}

          {residentCount === 0 && !isMoving && (
            <EmptyHint>
              아직 아무도 없어요 🏜️
              <br />첫 번째 주민이 되어보세요!
            </EmptyHint>
          )}
        </MapInner>
      </MapContainer>

      {/* 유저 카드 모달 */}
      {selectedUser && (
        <Overlay onClick={() => setSelectedUser(null)}>
          <UserCard onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={() => setSelectedUser(null)}>✕</CloseBtn>

            <CardHouseBadge>
              <img
                src={
                  HOUSES.find(
                    (h) =>
                      h.id === (selectedUser.equippedHouseId ?? "house_basic"),
                  )?.badge ?? HOUSES[0].badge
                }
                alt="house badge"
              />
            </CardHouseBadge>
            <CardHouseName>
              {HOUSES.find(
                (h) => h.id === (selectedUser.equippedHouseId ?? "house_basic"),
              )?.name ?? "기본 지붕집"}{" "}
              거주중
            </CardHouseName>

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

/* 뷰포트 - 고정 크기, overflow hidden */
const MapContainer = styled.div<{ $isMoving: boolean }>`
  width: 100%;
  height: calc(100dvh - 290px); // 네비+탭+버튼 높이 빼기
  @media (min-width: 769px) {
    height: calc(100dvh - 130px); // PC는 하단 네비 없음
  }
  overflow: hidden; // 👈이미 있어서 가장자리 집 잘림
  border-radius: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: ${({ $isMoving }) => ($isMoving ? "crosshair" : "grab")};
  &:active {
    cursor: ${({ $isMoving }) => ($isMoving ? "crosshair" : "grabbing")};
  }
  user-select: none;
  position: relative;
`;

/* 실제 맵 - 뷰포트보다 큼 */
const MapInner = styled.div<{ $isMoving: boolean; $scale: number }>`
  position: relative;
  width: ${({ $scale }) => MAP_WIDTH * $scale}px; // 👈 실제 크기 변경
  height: ${({ $scale }) => MAP_HEIGHT * $scale}px; // 👈 실제 크기 변경
  cursor: ${({ $isMoving }) => ($isMoving ? "crosshair" : "inherit")};
`;

const GrassBase = styled.div`
  position: absolute;
  inset: 0;
  background: url(${villageBg}) center/cover no-repeat;
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

  &:hover {
    z-index: 10;
  }
  &:hover > div:last-child {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const HouseBadge = styled.div<{ $scale: number }>`
  width: ${({ $scale }) => Math.max(60, 150 * $scale)}px; // 최소 60px
  height: ${({ $scale }) => Math.max(60, 150 * $scale)}px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
  background: rgba(80, 120, 255, 0.1);
  animation: ${pulse} 1.2s ease-in-out infinite;
  pointer-events: none;
  z-index: 20;
  border: 3px dashed rgba(80, 120, 255, 0.4);
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
  width: 100px;
  height: 100px;
  margin-bottom: 4px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
  margin-top: -20px;
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

//안내팝업문구
const GuideButton = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  white-space: nowrap;
  &:hover {
    transform: scale(1.03);
  }
`;

const GuideCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px 16px;
  width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
`;

const GuideTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  text-align: center;
`;

const GuideRow = styled.div<{ $unlocked: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  opacity: ${({ $unlocked }) => ($unlocked ? 1 : 0.5)};
`;

const GuideBadge = styled.div`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const GuideInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const GuideName = styled.div<{ $unlocked: boolean }>`
  font-size: 13px;
  font-weight: 800;
  color: ${({ $unlocked, theme }) =>
    $unlocked ? theme.colors.text : theme.colors.muted};
`;

const GuideDesc = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const GuideMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const UnlockTag = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const LockTag = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;
`;
const MapHint = styled.div`
  position: absolute;
  top: 20%;
  right: 10px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: none;

  span {
    font-size: 11px;
    font-weight: 700;
    background: rgba(0, 0, 0, 0.45);
    color: white;
    padding: 3px 8px;
    border-radius: 999px;
  }
`;
