// src/types/userTypes.ts

import type { ProfileAvatarType } from "../data/static/profileAvatars";

/**
 * 커뮤니티/랭킹에서 사용하는 공개 유저 타입
 * Supabase profiles 테이블 기반
 */
export type PublicUser = {
  id: string;
  nickname: string;
  level: number;
  score: number;
  badges: string[];
  profileImage: string | null;
  profileAvatar: ProfileAvatarType | null;
  emoji: string;
  status: string;
  lastActive: number;
  selectedSkin: string;
};

//문의사항 타입
export type Inquiry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  status: "pending" | "checking" | "done";
  answer: string | null;
  created_at: string;
  answered_at: string | null;
};
