import ProfileCard from "../components/character/ProfileCard";
import AvatarGrid from "../components/character/AvatarGrid";
import ConfirmAvatar from "../components/character/ConfirmAvatar";
import LevelSection from "../components/character/LevelSection";
import StatusCard from "../components/character/StatusCard";

import { useCharacterProfile } from "../hooks/useCharacterProfile";
import { useModal } from "../context/UIContext/ModalContext";
import { useToast } from "../context/UIContext/ToastContext";
import SkinSection from "../components/character/SkinSection";
import { useItem } from "../context/UserContext/ItemContext";
import { useCharacter } from "../context/UserContext/CharacterContext";
import { cardSkins } from "../data/static/cardSkins";
import { useAchievement } from "../context/AchievementContext/AchievementContext";
import { ACHIEVEMENTS } from "../data/rules/achievementRules";
import styled from "styled-components";
import MyCardPreview from "../components/character/MyCardPreview";

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
  const { selectSkin, selectedSkin, ownedSkins } = useItem();
  const { character } = useCharacter();
  const { achieved } = useAchievement(); //업적
  const { fileInputRef, cameraInputRef } = useCharacterProfile(); //프로필사진첨부

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
                  setProfileImage(null);
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

    const url = URL.createObjectURL(file);

    openModal({
      type: "CONFIRM",
      title: "프로필 변경",
      confirmText: "적용",
      cancelText: "취소",

      customContent: (
        <ConfirmImage>
          <PreviewImage src={url} />
          <Text>이 사진으로 변경할까요?</Text>
        </ConfirmImage>
      ),

      onConfirm: () => {
        setProfileImage(url);
        setProfileAvatar(null);
        createToast("프로필 변경 완료 📸");
      },
    });
    e.target.value = "";
  };

  return (
    <PageWrapper>
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
        <ProfileCard
          nickname={nickname}
          profileAvatar={profileAvatar}
          profileImage={profileImage}
          onClick={openProfileModal}
        />

        <LevelSection level={1} currentExp={30} neededExp={100} percent={30} />

        <StatusCard
          coins={1000}
          achievements={achieved
            .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
            .filter(Boolean)}
        />
      </ProfileSection>
      {/* ⭐ 내 카드미리보기 */}
      <MyCardPreview
        nickname={nickname}
        level={character.level}
        emoji="🐣"
        currentSkin={currentSkin}
      />
      <SkinSection
        skins={filteredSkins}
        selectedSkin={selectedSkin ?? ""}
        characterLevel={character.level}
        onSelect={(id) => {
          selectSkin(id);
          createToast("카드 변경 완료 🎉");
        }}
      />
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
