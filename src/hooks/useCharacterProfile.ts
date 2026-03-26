import { useRef } from "react";
import type { ProfileAvatarType } from "../data/static/profileAvatars";
import { useUser } from "../context/UserContext";

/**
 * 👤 캐릭터 프로필 상태 관리 훅
 *
 * 역할: 프로필 이미지 / 아바타 / 닉네임 변경
 * - 상태는 UserContext(user)에서 읽고 setUser로 저장
 * - localStorage 저장은 UserContext useEffect가 통합 처리
 *
 * 💡 이미지 ↔ 아바타는 동시에 사용 불가 (하나 설정하면 다른 하나 제거)
 */
export const useCharacterProfile = () => {
  const { user, setUser } = useUser();

  // 📸 파일 input refs (카메라 / 갤러리)
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🖼 아바타 설정 (설정 시 profileImage 제거)
  const setProfileAvatar = (avatar: ProfileAvatarType | null) => {
    setUser((prev) => ({
      ...prev,
      profileAvatar: avatar,
      profileImage: avatar ? "" : prev.profileImage, // 아바타 쓰면 이미지 제거
    }));
  };

  // 📷 프로필 이미지 설정 (설정 시 profileAvatar 제거)
  const setProfileImage = (img: string | null) => {
    setUser((prev) => ({
      ...prev,
      profileImage: img ?? "",
      profileAvatar: img ? null : prev.profileAvatar, // 이미지 쓰면 아바타 제거
    }));
  };

  // ✏️ 닉네임 변경
  const setNickname = (name: string) => {
    setUser((prev) => ({ ...prev, nickname: name }));
  };

  return {
    profileAvatar: user.profileAvatar,
    profileImage: user.profileImage,
    nickname: user.nickname,
    setProfileAvatar,
    setProfileImage,
    setNickname,
    cameraInputRef,
    fileInputRef,
  };
};
