/**
 * 원화 → 달러 변환
 */
export const krwToUsd = (krw: number, rate: number) => {
  return Math.round(krw / rate);
};

/**
 * 달러 → 원화 변환
 */
export const usdToKrw = (usd: number, rate: number) => {
  return Math.round(usd * rate);
};
