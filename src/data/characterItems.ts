//캐릭터아이템 mock 데이터(추후 변경예정)

import type { EquipSlot } from "../context/ItemContext";

export type CharacterItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  slot: EquipSlot;
};

export const characterItems: CharacterItem[] = [
  { id: "hat", name: "모자", emoji: "🧢", price: 5, slot: "hat" },
  { id: "shirt", name: "티셔츠", emoji: "👕", price: 3, slot: "top" },
  { id: "shoes", name: "운동화", emoji: "👟", price: 4, slot: "shoes" },
];
