// 날짜를 YYYY-MM-DD 형태로 반환
// - 출석 / 달력 / 비교용으로 사용

export const getDateKey = (date: Date = new Date()) => {
  return date.toISOString().split("T")[0];
};
