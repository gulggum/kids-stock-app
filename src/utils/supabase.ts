import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//Supabase 서버에 접속 => 필요한 곳에서 연결 설정
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
