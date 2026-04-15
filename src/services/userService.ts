import { isValidNickname } from "../utils/nicknameFilter";
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

export const validateNickname = async (value: string) => {
  if (!value.trim()) {
    return "닉네임을 입력해주세요";
  }

  if (value.trim().length < 2) {
    return "닉네임은 2글자 이상이에요";
  }

  if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) {
    return "한글, 영어, 숫자만 사용할 수 있어요";
  }

  if (!isValidNickname(value)) {
    return "사용할 수 없는 닉네임이에요";
  }

  const isDuplicate = await checkNicknameDuplicate(value);

  if (isDuplicate) {
    return "이미 사용 중인 닉네임이에요";
  }

  return null;
};
