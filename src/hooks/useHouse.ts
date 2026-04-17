// src/hooks/useHouse.ts
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "../context/UserContext";

// ─────────────────────────────────────────
// 📌 타입 정의
// ─────────────────────────────────────────
export type OwnedHouse = {
  houseId: string;
  isEquipped: boolean;
};

export const useHouse = () => {
  const { user, spendCoin, setUser } = useUser();
  const [ownedHouses, setOwnedHouses] = useState<OwnedHouse[]>([]);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────
  // 📌 로그인 시 보유한 집 목록 불러오기
  // user.id 바뀔 때마다 재실행 (로그인/로그아웃 대응)
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!user.id) return;

    const fetchOwnedHouses = async () => {
      if (!user.id) {
        setOwnedHouses([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("user_house_frames")
        .select("frame_id, is_equipped")
        .eq("user_id", user.id);

      if (error) {
        console.error("집 목록 불러오기 실패", error);
        return;
      }

      // DB 컬럼명(snake_case) → 타입(camelCase) 변환
      setOwnedHouses(
        (data || []).map((row) => ({
          houseId: row.frame_id,
          isEquipped: row.is_equipped,
        })),
      );
      setLoading(false);
    };

    fetchOwnedHouses();
  }, [user.id]);

  // ─────────────────────────────────────────
  // 🔍 보유 여부 확인
  // house_basic은 모든 유저 기본 보유
  // ─────────────────────────────────────────
  const isOwned = (houseId: string) =>
    houseId === "house_basic" || ownedHouses.some((h) => h.houseId === houseId);

  // ─────────────────────────────────────────
  // 👒 현재 착용 중인 집 id
  // 착용한 게 없으면 기본집으로 fallback
  // ─────────────────────────────────────────
  const equippedHouseId = user.equippedHouseId ?? "house_basic";
  // ─────────────────────────────────────────
  // 💰 집 구매
  // 1. 이미 보유 여부 확인
  // 2. spendCoin으로 코인 차감 (DB + 로컬 상태 한번에)
  // 3. user_house_frames에 구매 기록 insert
  // ─────────────────────────────────────────
  const buyHouse = async (houseId: string, price: number) => {
    if (isOwned(houseId)) return "ALREADY_OWNED";

    const success = spendCoin(price);
    if (!success) return "NOT_ENOUGH_COIN";

    const { error } = await supabase
      .from("user_house_frames")
      .insert({ user_id: user.id, frame_id: houseId, is_equipped: false });

    if (error) {
      console.error("집 구매 실패", error);
      return "ERROR";
    }

    // 로컬 상태 즉시 반영 (DB 재fetch 없이 UI 바로 업데이트)
    setOwnedHouses((prev) => [...prev, { houseId, isEquipped: false }]);
    return "SUCCESS";
  };

  // ─────────────────────────────────────────
  // 👗 집 착용/교체
  // 1. 기존 착용 전체 해제 (is_equipped = false)
  // 2. 선택한 집만 착용 (is_equipped = true)
  // house_basic은 DB 기록 없으므로 update 스킵
  // ─────────────────────────────────────────
  const equipHouse = async (houseId: string) => {
    if (!isOwned(houseId)) return;

    // 먼저 UI부터 바로 변경
    setOwnedHouses((prev) =>
      prev.map((h) => ({
        ...h,
        isEquipped: h.houseId === houseId,
      })),
    );

    // 내 모든 집 착용 해제
    await supabase
      .from("user_house_frames")
      .update({ is_equipped: false })
      .eq("user_id", user.id);

    // 기본집이 아닐 때만 DB에 착용 표시
    if (houseId !== "house_basic") {
      await supabase
        .from("user_house_frames")
        .update({ is_equipped: true })
        .eq("user_id", user.id)
        .eq("frame_id", houseId);
    }

    // 로컬 상태 동기화
    setOwnedHouses((prev) =>
      prev.map((h) => ({ ...h, isEquipped: h.houseId === houseId })),
    );
    setUser((prev) => ({ ...prev, equippedHouseId: houseId }));
  };

  return {
    ownedHouses,
    equippedHouseId,
    isOwned,
    buyHouse,
    equipHouse,
    loading,
  };
};
