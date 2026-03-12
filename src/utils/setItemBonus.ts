import { characterItems, ITEM_SETS } from "./../data/static/characterItems";
import type { EquipSlots } from "../context/UserContext/ItemContext";

// ---------------------------------
// ⭐ 현재 장착 아이템 기준 세트효과 계산
// CharacterPage / CharacterContext에서 사용
// ---------------------------------

export function getActiveSetBonus(equipped: EquipSlots) {
  const equippedIds = Object.values(equipped).filter(Boolean);

  const setIds = equippedIds
    .map((id) => characterItems.find((i) => i.id === id)?.setId)
    .filter(Boolean);

  const result: Record<string, any> = {};

  Object.entries(ITEM_SETS).forEach(([setId, set]) => {
    const count = setIds.filter((s) => s === setId).length;

    if (count >= set.required) {
      result[setId] = set.bonus;
    }
  });

  return result;
}
