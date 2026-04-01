// utils/nicknameFilter.ts
const bannedWords = ["바보", "멍청이", "욕", "꺼져", "죽어", "싫어", "미워"];

export const isValidNickname = (nickname: string) => {
  if (!nickname.trim()) return false;

  const lower = nickname.toLowerCase();

  return !bannedWords.some((word) => lower.includes(word));
};
