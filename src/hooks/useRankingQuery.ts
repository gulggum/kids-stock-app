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
  // 1. 프로필 조회
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select(
      `
      id,
      nickname,
      level,
      score,
      achievements,
      last_active,
      avatar,
      selected_skin,
      status,
      village_x,
      village_y
    `,
    )
    .order("score", { ascending: false });

  if (profilesError) throw new Error(profilesError.message);

  // 2. 유저 집 정보 조회
  const { data: houseData, error: houseError } = await supabase
    .from("user_house_frames")
    .select("user_id, frame_id, is_equipped");

  if (houseError) throw new Error(houseError.message);

  // 3. profiles + house 데이터 합치기
  return (profilesData ?? []).map((user) => {
    const equippedHouseId =
      houseData?.find(
        //현재 유저 id랑 같은 집 데이터 찾아 가져오기
        (house) => house.user_id === user.id && house.is_equipped === true,
      )?.frame_id ?? "house_basic";

    return {
      id: user.id,
      nickname: user.nickname ?? "유저",
      level: user.level ?? 1,
      levelTitle: "",
      score: user.score ?? 0,
      badges: user.achievements ?? [],
      profileImage: null,
      profileAvatar: user.avatar ?? null,
      selectedSkin: user.selected_skin ?? "basic",
      status: user.status ?? "😄 오늘도 열심히!",
      emoji: "🙂",
      lastActive: user.last_active ? new Date(user.last_active).getTime() : 0,
      equippedHouseId,
      villageX: user.village_x ?? null,
      villageY: user.village_y ?? null,
    };
  });
};

export const useRankingQuery = () => {
  return useQuery({
    queryKey: ["ranking"],
    queryFn: fetchRanking,
    staleTime: 0, // 5분 캐싱
    retry: 1,
  });
};
