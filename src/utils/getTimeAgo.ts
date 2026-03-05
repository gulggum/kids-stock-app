//접속시간 체크시 사용 예정
export const getTimeAgo = (lastActive: number) => {
  const diff = Date.now() - lastActive;

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  return `${hours}시간 전`;
};
