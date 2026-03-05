//온라인 체크 함수

export const isUserOnline = (lastActive: number) => {
  const FIVE_MINUTES = 1000 * 60 * 5;
  return Date.now() - lastActive < FIVE_MINUTES;
};
