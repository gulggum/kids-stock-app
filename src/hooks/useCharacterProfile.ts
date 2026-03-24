import { useEffect, useRef, useState } from "react";
import type { ProfileAvatarType } from "../data/static/profileAvatars";

/**
 * 👤 캐릭터 프로필 상태 관리 훅
 */
export const useCharacterProfile = () => {
  const [profileAvatar, setProfileAvatarState] =
    useState<ProfileAvatarType | null>(null);

  const [profileImage, setProfileImageState] = useState<string | null>(
    localStorage.getItem("profileImage") || null,
  );

  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || "나",
  );

  // 📸 input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📦 초기 로드 (1번만)
  useEffect(() => {
    const savedAvatar = localStorage.getItem("profileAvatar");

    if (savedAvatar) {
      setProfileAvatarState(JSON.parse(savedAvatar));
    }
  }, []);

  // 🔥 아바타 설정
  const setProfileAvatar = (avatar: ProfileAvatarType | null) => {
    setProfileAvatarState(avatar);

    if (avatar) {
      localStorage.setItem("profileAvatar", JSON.stringify(avatar));

      // 🔥 핵심 (이미지 제거)
      setProfileImageState(null);
      localStorage.removeItem("profileImage");
    }
  };

  // 🔥 이미지 설정
  const setProfileImage = (img: string | null) => {
    setProfileImageState(img);

    if (img) {
      localStorage.setItem("profileImage", img);

      // 🔥 핵심 (아바타 제거)
      setProfileAvatarState(null);
      localStorage.removeItem("profileAvatar");
    }
  };

  // 🔥 닉네임
  const handleNickname = (name: string) => {
    setNickname(name);
    localStorage.setItem("nickname", name);
  };

  return {
    profileAvatar,
    profileImage,
    nickname,
    setProfileAvatar,
    setProfileImage,
    setNickname: handleNickname,
    cameraInputRef,
    fileInputRef,
  };
};
