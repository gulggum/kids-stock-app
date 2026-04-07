// 📊 차트 데이터 가져오는 훅
// → 우리 서버(/api/chart)를 호출함

import { useQuery } from "@tanstack/react-query";

export const useChart = (symbol: string, period: "7d" | "30d") => {
  return useQuery({
    queryKey: ["chart", symbol, period],

    queryFn: async () => {
      const res = await fetch(`/api/chart?symbol=${symbol}&period=${period}`);

      if (!res.ok) throw new Error("차트 불러오기 실패");

      const data = await res.json();
      return data.data;
    },

    enabled: !!symbol, // symbol 있을 때만 실행
  });
};
