import ProfileCard from "../components/character/ProfileCard";
import AvatarGrid from "../components/character/AvatarGrid";
import ConfirmAvatar from "../components/character/ConfirmAvatar";
import LevelSection from "../components/character/LevelSection";
import StatusCard from "../components/character/StatusCard";
import { useCharacterProfile } from "../hooks/useCharacterProfile";
import { useModal } from "../context/UIContext/ModalContext";
import { useToast } from "../context/UIContext/ToastContext";
import SkinSection from "../components/character/SkinSection";
import { useSkinItem } from "../context/UserContext/SkinItemContext";
import { cardSkins } from "../data/static/cardSkins";
import { useAchievement } from "../context/AchievementContext/AchievementContext";
import { ACHIEVEMENTS } from "../data/rules/achievementRules";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext/UserContext";

const CharacterPage = () => {
  const {
    profileAvatar,
    profileImage,
    nickname,
    setProfileAvatar,
    setProfileImage,
  } = useCharacterProfile();

  const { openModal, closeModal } = useModal();
  const { createToast } = useToast();
  const { selectSkin, selectedSkin, ownedSkins } = useSkinItem();
  const { achieved } = useAchievement(); //업적
  const { fileInputRef, cameraInputRef } = useCharacterProfile(); //프로필사진첨부
  const navigate = useNavigate();
  const { user } = useUser();

  const filteredSkins = ownedSkins
    .map((id) => cardSkins.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  const currentSkin = cardSkins.find((s) => s.id === selectedSkin);

  const openProfileModal = () => {
    openModal({
      title: "프로필 선택",
      hideActions: true,
      customContent: (
        <ModalContent>
          <UploadWrapper>
            <CloseButton onClick={closeModal}>✖</CloseButton>
            {/* 📸 업로드 버튼 */}
            <UploadButton onClick={() => fileInputRef.current?.click()}>
              📸 사진 찍기
            </UploadButton>

            <UploadButton onClick={() => cameraInputRef.current?.click()}>
              🖼 앨범 선택
            </UploadButton>
          </UploadWrapper>
          {/* 🧒 캐릭터 선택 */}
          <AvatarGrid
            onSelect={(avatar) => {
              openModal({
                type: "CONFIRM",
                customContent: <ConfirmAvatar avatar={avatar} />,
                onConfirm: () => {
                  setProfileAvatar(avatar);
                  createToast("캐릭터 선택 완료 🎉");
                },
              });
            }}
          />
        </ModalContent>
      ),
      type: "CONFIRM",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader(); // 🔥 이게 필요

    reader.onloadend = () => {
      const base64 = reader.result as string; // 🔥 여기서 생성됨

      openModal({
        type: "CONFIRM",
        title: "프로필 변경",
        confirmText: "적용",
        cancelText: "취소",

        customContent: (
          <ConfirmImage>
            <PreviewImage src={base64} /> {/* 🔥 url 말고 base64 */}
            <Text>이 사진으로 변경할까요?</Text>
          </ConfirmImage>
        ),

        onConfirm: () => {
          setProfileImage(base64); // 🔥 이제 정상 작동
          createToast("프로필 변경 완료 📸");
        },
      });
    };

    reader.readAsDataURL(file); // 🔥 여기서 실행됨
  };

  return (
    <PageWrapper>
      <Title>🙌 나의 정보</Title>
      <Description>나의 프로필사진과 스킨을 꾸며보세요 😊</Description>
      {/* 📸 카메라 */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* 🖼 앨범 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <ProfileSection>
        {/* 내상태 (보유코인 및 뱃지모음) */}
        <StatusCard
          achievements={achieved
            .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
            .filter(Boolean)}
        />

        <ProfileCard
          nickname={nickname}
          profileAvatar={profileAvatar}
          profileImage={profileImage}
          currentSkin={currentSkin}
          level={user.level}
          onClick={openProfileModal}
        />
        {/* 레벨상태 */}
        <LevelSection level={1} currentExp={30} neededExp={100} percent={30} />
      </ProfileSection>

      {/* 내카드스킨 보유 목록 */}

      {filteredSkins.length === 0 ? (
        <Empty>
          아직 보유한 카드 스킨이 없어요 🥲
          <SmallHint>상점에서 새로운 스킨을 구매해보세요!</SmallHint>
          <GoMarketButton onClick={() => navigate("/shop")}>
            🎨 스킨 보러가기
          </GoMarketButton>
        </Empty>
      ) : (
        <SkinSection
          skins={filteredSkins}
          selectedSkin={selectedSkin ?? ""}
          characterLevel={user.level}
          onSelect={(id) => {
            selectSkin(id);
            createToast("카드 변경 완료 🎉");
          }}
        />
      )}
    </PageWrapper>
  );
};

export default CharacterPage;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 900;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: -6px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
`;
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const UploadButton = styled.button`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  font-weight: 700;
  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: scale(1.03);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const ConfirmImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;

  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Text = styled.div`
  font-size: 14px;
`;

const UploadWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
`;
const CloseButton = styled.button`
  position: absolute;
  top: -60px;
  right: -5px;
  padding: 3px 8px;

  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
  font-size: 18px;
  z-index: 10000;
  cursor: pointer;
`;

//마켓가기 스타일

const Empty = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  text-align: center;
  font-size: 15px;
`;

const SmallHint = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;
const GoMarketButton = styled.button`
  margin-top: 15px;

  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;

  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;
