import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import type { PublicUser } from "../types/UserType";

/**
 * 전체 유저 랭킹 가져오기
 *
 * [흐름]
 * 1. Supabase profiles 테이블에서 전체 유저 가져오기
 * 2. score 기준 내림차순 정렬
 * 3. RankingUser 타입으로 변환
 *
 * [캐싱]
 * - staleTime 5분 → 자주 바뀌지 않으니까 적당히 캐싱
 */

const fetchRanking = async (): Promise<PublicUser[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `id, nickname, level, score, achievements, last_active, avatar, selected_skin,status, village_x, village_y,user_house_frames!left (frame_id, is_equipped)`,
    )
    .order("score", { ascending: false }); // score 높은 순

  if (error) throw new Error(error.message);

  // Supabase 데이터 → RankingUser 타입으로 변환
  return (data ?? []).map((user) => ({
    id: user.id,
    nickname: user.nickname ?? "유저",
    level: user.level ?? 1,
    levelTitle: "",
    score: user.score ?? 0,
    badges: user.achievements ?? [], // achievements → badges로 매핑
    profileImage: null, // 사진은 본인만 보임
    profileAvatar: user.avatar ?? null,
    selectedSkin: user.selected_skin ?? "basic",
    status: user.status ?? "😄 오늘도 열심히!",
    emoji: "🙂", // 나중에 profileAvatar로 교체 예정
    lastActive: user.last_active // ← 추가
      ? new Date(user.last_active).getTime()
      : 0,
    // 👈 추가
    equippedHouseId:
      (user.user_house_frames as any[])?.find((f) => f.is_equipped)?.frame_id ??
      "house_basic",
    villageX: user.village_x ?? null,
    villageY: user.village_y ?? null,
  }));
};

export const useRankingQuery = () => {
  return useQuery({
    queryKey: ["ranking"],
    queryFn: fetchRanking,
    staleTime: 0, // 5분 캐싱
    retry: 1,
  });
};
