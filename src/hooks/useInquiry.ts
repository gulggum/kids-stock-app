import { supabase } from "../utils/supabase";
import type { Inquiry } from "../types/UserType";

export type InquiryWithProfile = Inquiry & {
  profiles?: {
    nickname: string;
  };
};

export const useInquiry = () => {
  // 문의 등록
  const createInquiry = async (
    userId: string,
    title: string,
    content: string,
    category: string,
  ) => {
    const { error } = await supabase.from("inquiries").insert({
      user_id: userId,
      title,
      content,
      category,
      status: "pending",
    });

    return { error };
  };

  // 현재 로그인한 유저의 문의 목록 조회
  const getMyInquiries = async (userId: string) => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return {
      inquiries: (data as Inquiry[]) ?? [],
      error,
    };
  };

  // 문의 상세 조회
  const getInquiryById = async (id: string) => {
    const { data, error } = await supabase
      .from("inquiries")
      .select(
        `
      *,
      profiles!inquiries_user_id_fkey (
        nickname
      )
    `,
      )
      .eq("id", id)
      .single();

    return {
      inquiry: data as InquiryWithProfile | null,
      error,
    };
  };

  // 관리자용 전체 문의 목록 조회
  const getAllInquiries = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select(
        `
      *,
        profiles!inquiries_user_id_fkey (
      nickname
    )
    `,
      )
      .order("created_at", { ascending: false });

    return {
      inquiries: (data as InquiryWithProfile[]) ?? [],
      error,
    };
  };

  // 관리자 답변 및 상태 수정
  const updateInquiry = async (
    id: string,
    status: Inquiry["status"],
    answer: string,
  ) => {
    const { error } = await supabase
      .from("inquiries")
      .update({
        status,
        answer,
        answered_at: status === "done" ? new Date().toISOString() : null,
      })
      .eq("id", id);

    return { error };
  };

  return {
    createInquiry,
    getMyInquiries,
    getInquiryById,
    getAllInquiries,
    updateInquiry,
  };
};
