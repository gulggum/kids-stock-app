// src/hooks/useAdminStats.ts
// 관리자 대시보드/통계용 Supabase 데이터 훅

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export type AdminStats = {
  totalUsers: number; // 총 유저 수
  todayUsers: number; //오늘 들어온 유저수
  todayActiveUsers: number; // 오늘 접속한 유저
  todayNews: number; // 오늘 등록된 뉴스
  todayTrades: number; // 오늘 거래 수
  todayTradeUsers: number; //거래활동한 유저 수
  todayQuizzes: number; // 오늘 퀴즈 푼 수
  totalInquiries: number; //문의 건수
  // 통계용
  reasonStats: { reason: string; count: number }[]; // 투자 이유 분포
  topStocks: { stock_name: string; count: number }[]; // 인기 종목 TOP5
};

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    todayUsers: 0,
    todayActiveUsers: 0,
    todayNews: 0,
    todayTrades: 0,
    todayTradeUsers: 0,
    todayQuizzes: 0,
    totalInquiries: 0,
    reasonStats: [],
    topStocks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);

      // 총 유저 수
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // 오늘 뉴스 수
      const { count: todayNews } = await supabase
        .from("news")
        .select("*", { count: "exact", head: true })
        .eq("date", today);

      // 오늘 거래 수
      const { count: todayTrades } = await supabase
        .from("trades")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);
      //거래활동한 유저 수(유저기준)
      const { data: todayTradeUserData } = await supabase
        .from("trades")
        .select("user_id")
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      const todayTradeUsers = new Set(todayTradeUserData?.map((t) => t.user_id))
        .size;

      // 오늘 퀴즈 푼 수
      const { count: todayQuizzes } = await supabase
        .from("user_news_log")
        .select("*", { count: "exact", head: true })
        .eq("date", today)
        .eq("quiz_done", true);

      // 오늘 가입한 유저
      const { count: todayUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_active", `${today}T00:00:00`)
        .lte("last_active", `${today}T23:59:59`);
      //오늘 접속한 유저
      const { count: todayActiveUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_active", `${today}T00:00:00`)
        .lte("last_active", `${today}T23:59:59`);

      // 문의 건수
      const { count: totalInquiries } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true });

      // 투자 이유 분포
      const { data: reasonData } = await supabase
        .from("trades")
        .select("reason")
        .eq("type", "BUY")
        .not("reason", "is", null);

      const reasonMap: Record<string, number> = {};
      (reasonData ?? []).forEach((t) => {
        const r = t.reason ?? "미선택";
        reasonMap[r] = (reasonMap[r] ?? 0) + 1;
      });
      const reasonStats = Object.entries(reasonMap)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count);

      // 인기 종목 TOP5
      const { data: tradeData } = await supabase
        .from("trades")
        .select("stock_name")
        .eq("type", "BUY");

      const stockMap: Record<string, number> = {};
      (tradeData ?? []).forEach((t) => {
        stockMap[t.stock_name] = (stockMap[t.stock_name] ?? 0) + 1;
      });
      const topStocks = Object.entries(stockMap)
        .map(([stock_name, count]) => ({ stock_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalUsers: totalUsers ?? 0,
        todayUsers: todayUsers ?? 0,
        todayActiveUsers: todayActiveUsers ?? 0,
        todayNews: todayNews ?? 0,
        todayTrades: todayTrades ?? 0,
        todayTradeUsers: todayTradeUsers ?? 0,
        todayQuizzes: todayQuizzes ?? 0,
        totalInquiries: totalInquiries ?? 0,
        reasonStats,
        topStocks,
      });
      setLoading(false);
    };

    fetch();
  }, []);

  return { stats, loading };
}
