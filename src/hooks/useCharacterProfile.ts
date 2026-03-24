import { useEffect, useRef, useState } from "react";
import type { ProfileAvatarType } from "../data/static/profileAvatars";

/**
 * 👤 캐릭터 프로필 상태 관리 훅
 */
export const useCharacterProfile = () => {
  const [profileAvatar, setProfileAvatar] = useState<ProfileAvatarType | null>(
    null,
  );

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("나");
  // 📸 input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📦 초기 로드
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    const savedName = localStorage.getItem("nickname");
    const savedAvatar = localStorage.getItem("profileAvatar");

    if (savedImage) setProfileImage(savedImage);
    if (savedName) setNickname(savedName);
    if (savedAvatar) setProfileAvatar(JSON.parse(savedAvatar));
  }, []);

  // 💾 저장
  useEffect(() => {
    if (profileImage) {
      localStorage.setItem("profileImage", profileImage);
    }
  }, [profileImage]);

  useEffect(() => {
    localStorage.setItem("nickname", nickname);
  }, [nickname]);
  useEffect(() => {
    if (profileAvatar) {
      localStorage.setItem("profileAvatar", JSON.stringify(profileAvatar));
    }
  }, [profileAvatar]);

  return {
    profileAvatar,
    profileImage,
    nickname,
    setProfileAvatar,
    setProfileImage,
    setNickname,
    cameraInputRef, // 📸 카메라용
    fileInputRef, // 🖼 앨범용
  };
};
