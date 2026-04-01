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
  "코인",
  "주식왕",
  "투자왕",
  "부자",
  "성장씨앗",
  "머니",
  "저금통",
  "황금나무",
  "코인부자",
  "주식꿈나무",
  "머니박스",
  "재테크왕",
  "부자꿈",
  "황금코인",
  "주식탐험가",
];

export const generateNickname = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const word = stockWords[Math.floor(Math.random() * stockWords.length)];
  const number = Math.floor(Math.random() * 1000);

  return `${adj}${word}${number}`;
};
