// 날짜를 YYYY-MM-DD 형태로 반환
// - 출석 / 달력 / 비교용으로 사용((로컬 날짜 사용))
//주의) toISOString() 은 UTC 기준이라서 , 한국에서는 날짜가 하루 밀릴 수 있음.

export const getDateKey = (date: Date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};
