// src/hooks/useExchangeRate.ts
// Supabase settings 테이블에서 환율 가져오는 훅
// update-stocks.js Cron 실행 시 자동 업데이트됨

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState(1350); // 기본값

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "exchange_rate")
        .single();

      if (data?.value) {
        setExchangeRate(Number(data.value));
      }
    };

    fetch();
  }, []);

  return exchangeRate;
}
