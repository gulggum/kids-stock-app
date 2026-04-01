import { supabase } from "../utils/supabase"; // 지금 위치 기준

export const checkNicknameDuplicate = async (nickname: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }

  return !!data;
};
