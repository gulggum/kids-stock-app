// src/hooks/useExchangeHistory.ts
// 환전 내역 조회 및 저장 훅
// exchange_history 테이블과 연동

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "../context/UserContext";

export type ExchangeRecord = {
  id: number;
  type: "BUY" | "SELL"; // BUY: 원화→달러, SELL: 달러→원화
  dollars: number;
  krw: number;
  rate: number;
  created_at: string;
};

export function useExchangeHistory() {
  const { user } = useUser();
  const [history, setHistory] = useState<ExchangeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 환전 내역 조회
  const fetchHistory = useCallback(async () => {
    if (!user.id) return;
    setLoading(true);

    const { data } = await supabase
      .from("exchange_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setHistory(data as ExchangeRecord[]);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 환전 기록 저장
  const saveExchange = async (
    type: "BUY" | "SELL",
    dollars: number,
    krw: number,
    rate: number,
  ) => {
    if (!user.id) return;

    const { data } = await supabase
      .from("exchange_history")
      .insert({ user_id: user.id, type, dollars, krw, rate })
      .select()
      .single();

    if (data) {
      // 목록 맨 위에 추가
      setHistory((prev) => [data as ExchangeRecord, ...prev]);
    }
  };

  return { history, loading, saveExchange, refetch: fetchHistory };
}
