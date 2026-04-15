import { supabase } from "../utils/supabase";

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
