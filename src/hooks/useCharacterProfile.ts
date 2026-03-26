import { useRef, useState } from "react";
import type { ProfileAvatarType } from "../data/static/profileAvatars";

/**
 * 👤 캐릭터 프로필 상태 관리 훅
 */
export const useCharacterProfile = () => {
  const [profileAvatar, setProfileAvatarState] =
    useState<ProfileAvatarType | null>(() => {
      const saved = localStorage.getItem("profileAvatar");
      return saved ? JSON.parse(saved) : null;
    });

  const [profileImage, setProfileImageState] = useState<string | null>(() => {
    return localStorage.getItem("profileImage") || null;
  });

  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || "나",
  );

  // 📸 input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 아바타 설정
  const setProfileAvatar = (avatar: ProfileAvatarType | null) => {
    setProfileAvatarState(avatar);

    if (avatar) {
      localStorage.setItem("profileAvatar", JSON.stringify(avatar));

      // 🔥 이미지 제거
      setProfileImageState(null);
      localStorage.removeItem("profileImage");
    } else {
      localStorage.removeItem("profileAvatar");
    }
    console.log("아바타들어옴:", avatar, profileAvatar);
  };

  // 🔥 이미지 설정
  const setProfileImage = (img: string | null) => {
    setProfileImageState(img);

    if (img) {
      localStorage.setItem("profileImage", img);

      // 🔥 아바타 제거
      setProfileAvatarState(null);
      localStorage.removeItem("profileAvatar");
    } else {
      localStorage.removeItem("profileImage");
    }
    console.log("사진들어옴:", img, profileImage);
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
