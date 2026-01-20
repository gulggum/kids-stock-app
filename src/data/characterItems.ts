//캐릭터아이템 mock 데이터(추후 변경예정)

export type CharacterItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
};

export const characterItems: CharacterItem[] = [
  { id: "hat", name: "모자", emoji: "🧢", price: 5 },
  { id: "shirt", name: "티셔츠", emoji: "👕", price: 3 },
  { id: "shoes", name: "운동화", emoji: "👟", price: 4 },
];
