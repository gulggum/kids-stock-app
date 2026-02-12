- 전체구조

Stock 매매 발생
↓
StockContext 상태 변경
↓
AchievementContext가 상태 감시
↓
조건 만족?
↓
RewardContext.giveReward()
↓
코인 / 점수 / 경험치 지급

## --

| 요소       | 설명            |
| ---------- | --------------- |
| id         | 업적 고유값     |
| condition  | 달성 조건       |
| reward     | 어떤 보상 지급  |
| isAchieved | 이미 달성했는지 |
