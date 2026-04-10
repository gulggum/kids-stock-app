// 오늘의 지식 훅
// - 오늘 지식 봤는지 Supabase 확인
// - 지식 팝업 열기/닫기
// - 확인 시 DB 저장 + 보상 지급

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "../context/UserContext";
import { useReward } from "../context/RewardContext";
import { knowledgeData, type Knowledge } from "../data/static/Knowledgedata";

export const useKnowledge = () => {
  const { user } = useUser();
  const { giveReward } = useReward();

  const [hasTodayKnowledge, setHasTodayKnowledge] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [todayKnowledge, setTodayKnowledge] = useState<Knowledge | null>(null);

  // 오늘 지식 봤는지 확인
  useEffect(() => {
    if (!user.id) return;

    const check = async () => {
      const today = new Date().toISOString().slice(0, 10);

      const { data } = await supabase
        .from("user_knowledge_log")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      setHasTodayKnowledge(!!data);
    };

    check();
  }, [user.id]);

  // 지식 팝업 열기
  const openKnowledge = useCallback(() => {
    // 오늘 날짜 기반으로 항상 같은 지식 (같은 날 여러 번 눌러도 동일)
    const today = new Date().toISOString().slice(0, 10);
    const index =
      today.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) %
      knowledgeData.length;

    setTodayKnowledge(knowledgeData[index]);
    setIsOpen(true);
  }, []);

  // 확인 버튼 클릭
  const confirmKnowledge = useCallback(async () => {
    if (!user.id || !todayKnowledge) return;

    const today = new Date().toISOString().slice(0, 10);

    // DB 저장
    await supabase.from("user_knowledge_log").insert({
      user_id: user.id,
      knowledge_title: todayKnowledge.title,
      date: today,
    });

    // 보상 지급
    giveReward("DAILY_KNOWLEDGE");

    setHasTodayKnowledge(true);
    setIsOpen(false);
  }, [user.id, todayKnowledge, giveReward]);

  return {
    hasTodayKnowledge,
    isOpen,
    todayKnowledge,
    openKnowledge,
    confirmKnowledge,
    closeKnowledge: () => setIsOpen(false),
  };
};
