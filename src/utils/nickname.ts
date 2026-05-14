const adjectives = [
  "반짝",
  "쑥쑥",
  "용감",
  "행복",
  "신난",
  "알콩",
  "달콤",
  "튼튼",
  "반짝반짝",
  "기쁜",
  "씩씩",
  "총총",
  "포근",
  "활짝",
  "재밌는",
];
const stockWords = [
  "탐험가",
  "꿈나무",
  "반짝별",
  "무지개",
  "행운별",
  "성장씨앗",
  "저금통",
  "황금나무",
  "호기심대장",
  "모험가",
  "웃음꽃",
  "별빛친구",
  "행복열매",
  "반짝구름",
  "용기대장",
];

export const generateNickname = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const word = stockWords[Math.floor(Math.random() * stockWords.length)];
  const number = Math.floor(Math.random() * 1000);

  return `${adj}${word}${number}`;
};
