/**
 * 🎭 스프라이트 아바타 타입
 */
export type ProfileAvatarType = {
  id: string;
  x: number;
  y: number;
};

/**
 * 🧩 5 x 3 grid (총 15개)
 */
export const profileAvatars: ProfileAvatarType[] = [
  // y = 0
  { id: "a1", x: 0, y: 0 },
  { id: "a2", x: 1, y: 0 },
  { id: "a3", x: 2, y: 0 },
  { id: "a4", x: 3, y: 0 },
  { id: "a5", x: 4, y: 0 },

  // y = 1
  { id: "a6", x: 0, y: 1 },
  { id: "a7", x: 1, y: 1 },
  { id: "a8", x: 2, y: 1 },
  { id: "a9", x: 3, y: 1 },
  { id: "a10", x: 4, y: 1 },

  // y = 2
  { id: "a11", x: 0, y: 2 },
  { id: "a12", x: 1, y: 2 },
  { id: "a13", x: 2, y: 2 },
  { id: "a14", x: 3, y: 2 },
  { id: "a15", x: 4, y: 2 },
];
