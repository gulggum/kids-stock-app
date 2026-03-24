//배경밝기 계산해서 색 바꾸기 함수
export const getTextColor = (bg: string) => {
  const hex = bg.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 150 ? "#222" : "#fff";
};

//👉 gradient / image 둘 다 대응하려면 👉 대표 색 하나 뽑아서 계산

export const getTextColorFromSkin = (skin: any) => {
  // 1️⃣ gradient면 첫 색 추출
  if (skin?.gradient) {
    const match = skin.gradient.match(/#([0-9A-Fa-f]{6})/);
    const hex = match ? match[0] : "#ffffff";

    return getTextColor(hex);
  }

  // 2️⃣ image면 그냥 흰색 (이미지는 계산 어려움)
  if (skin?.image) {
    return "#222";
  }

  // 3️⃣ 기본
  return "#222";
};
