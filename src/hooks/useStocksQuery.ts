// Supabase → 기존 Stock 타입으로 변환해주는 훅
// emoji → character, change_rate → changeRate 자동 변환
// symbol 필드도 같이 포함해서 반환
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabase";
import type { Stock } from "../data/mock/marketMock";

type SupabaseStock = {
  id: number;
  name: string;
  symbol: string;
  description: string | null;
  emoji: string | null;
  country: "KR" | "US";
  category: string | null;
  price: number;
  change_rate: number;
  updated_at: string;
};

// ✅ symbol을 Stock 타입에 추가해서 chartMock 키로 활용
const toStock = (s: SupabaseStock): Stock & { symbol: string } => ({
  id: s.id,
  name: s.name,
  symbol: s.symbol, // ← chartMock 조회용
  character: s.emoji ?? "📈",
  price: s.price,
  changeRate: s.change_rate,
  country: s.country,
  category: s.category ?? "",
  description: s.description ?? "",
});

// ─────────────────────────────────────────────
// 전체 종목 목록
// ─────────────────────────────────────────────
export function useStocksQuery() {
  const [stocks, setStocks] = useState<(Stock & { symbol: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("stocks")
      .select("*")
      .order("country")
      .order("name");

    if (err) {
      setError(err.message);
    } else if (data) {
      setStocks((data as SupabaseStock[]).map(toStock));
    }

    setLoading(false);
  }, []);
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return { stocks, loading, error, refetch: fetchStocks };
}

// ─────────────────────────────────────────────
// 단일 종목 (StockDetail용)
// ─────────────────────────────────────────────
export function useStockByIdQuery(id: number | null) {
  const [stock, setStock] = useState<(Stock & { symbol: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("stocks")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setStock(toStock(data as SupabaseStock));
      setLoading(false);
    };

    fetch();
  }, [id]);

  return { stock, loading };
}
