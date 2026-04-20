# 🪙 KidsStock

> 어린이를 위한 주식 체험 금융 교육 앱

📅 개발 기간: 2026.01.17 ~ 진행 중  
🔗 배포 링크: [kids-stock-app.vercel.app](https://kids-stock-app.vercel.app)

---

## 기획 의도

아이들이 주식을 '돈벌이'가 아닌 **'경험'과 '이해'**의 관점에서 접할 수 있도록 설계한 어린이용 주식 체험 앱입니다.

실제 돈이 아닌 가상 사이버머니(100만원)를 사용해 투자 흐름, 가격 변동, 기다림과 선택의 개념을 게임처럼 자연스럽게 경험할 수 있습니다.

---

## 기술 스택

| 분류       | 기술                                 |
| ---------- | ------------------------------------ |
| 프레임워크 | React + TypeScript                   |
| 빌드       | Vite                                 |
| 스타일     | styled-components                    |
| 라우팅     | React Router                         |
| 상태관리   | Context API + TanStack Query         |
| 백엔드/DB  | Supabase (Auth + PostgreSQL + RLS)   |
| 배포       | Vercel (Serverless Functions + Cron) |
| 외부 API   | Yahoo Finance, NewsAPI, Gemini AI    |

---

## 주요 기능

### 📈 주식 마켓

- 한국/미국 주식 실시간 데이터 (Yahoo Finance API)
- Vercel Cron으로 하루 1회 자동 가격 업데이트
- 주식 상세 페이지 (차트 + 아이 눈높이 설명)
- 원화/달러 환전 기능 (미국 주식 구매용)
- 투자 이유 기록 기능

### 💰 포트폴리오

- 보유 주식 목록 및 평균 매수가 계산
- 총 자산 실시간 계산 (현금 + 주식 평가액)
- 거래 내역 히스토리
- 파산 시 50만원 지원금 지급 후 재시작

### 📰 뉴스 & 퀴즈

- 관리자 페이지에서 뉴스 직접 등록
- 관리자가 ChatGPT로 아이 눈높이 변환 후 직접 업로드
- TanStack Query로 24시간 캐싱
- 뉴스 기반 퀴즈 → 코인/경험치 보상

### 🎮 게임화 시스템

- 경험치(EXP) 기반 10단계 레벨 시스템
- 레벨별 칭호 (🐣 투자 새싹 → 👑 투자 마스터)
- 22개 업적 (COMMON / RARE / LEGEND 티어)
- 매일 출석 + 연속 출석 보너스
- 오늘의 지식 보상

### 🏠 집 시스템

- 레벨 달성 + 코인으로 집 구매
- 5단계 집 (기본집 → 아파트 → 펜트하우스 → 성 → 우주정거장)
- 프로필 카드 + 커뮤니티 카드에 집 뱃지 표시

### 🏘️ 마을 페이지

- 드래그로 맵 자유 이동
- 핀치/휠 줌 확대·축소
- 이사하기로 원하는 위치에 집 배치
- 친구 집 클릭 시 프로필 카드 팝업
- 활동한 유저만 마을에 표시

### 👥 커뮤니티

- 활동 점수 / 업적 수 기반 랭킹
- 친구 추가 / 피드 기능
- 카드스킨 커스터마이징 (48종)

---

## 아키텍처

### 상태관리 구조

```
Context
├── UserContext        → 유저 정보 단일 출처 (exp, coin, level 등)
├── TradeContext       → 거래 기록 원본 (BUY / SELL)
├── PortfolioContext   → 거래 기록 기반 파생 데이터 (보유현황, 총자산)
├── RewardContext      → 보상 지급 단일 창구
├── AchievementContext → 업적 조건 감시 + 보상 지급
├── QuizContext        → 퀴즈 상태
└── UIContext          → 모달 / 토스트 등 UI 상태
```

### Supabase 테이블 구조

```
profiles          → 유저 정보 (레벨, 코인, 업적, 마을 위치 등)
wallets           → 자산 (원화, 달러)
trades            → 거래 내역
stocks            → 주식 데이터
news              → 뉴스 + AI 변환 결과
news_quizzes      → 뉴스 퀴즈
user_news_log     → 뉴스/퀴즈 이력
user_knowledge_log→ 오늘의 지식 이력
exchange_history  → 환전 내역
house_frames      → 집 카탈로그
user_house_frames → 유저 구매/착용 집
inquiries         → 문의하기
```

### Vercel Serverless Functions

```
api/update-stocks.ts → Yahoo Finance 주가 업데이트 (Cron)
```

---

## 구현 포인트

### 인증 (Auth)

- Supabase Auth 기반 이메일/비밀번호 로그인
- 게스트 로그인 (UUID 기반 익명 계정 자동 생성)
- `onAuthStateChange` 단일 리스너 패턴으로 stale closure 방지

### 보안 (RLS)

- `profiles` 테이블은 본인 데이터만 수정 가능
- 게임 데이터는 통계용 전체 조회 허용
- 커뮤니티 집 정보는 별도 전체 공개 정책 적용

### 성능

- TanStack Query로 뉴스 24시간 캐싱
- `Promise.all`로 로그인 시 DB 병렬 fetch
- `useRef`로 async 콜백의 stale closure 방지

### 보상 밸런스

- 행동별 보상은 `rewardRules.ts` 단일 파일 관리
- 하루 기본 플레이 시 약 80~100 코인 획득
- 집 가격은 레벨 도달 시 코인으로 구매 가능한 수준으로 설계

---

## 트러블슈팅

주요 트러블슈팅은 [Velog 개발일지](https://velog.io/@gulggum/series/StockKids%EA%B0%9C%EB%B0%9C)에서 확인할 수 있습니다.

---

## 스크린샷

> 추가 예정

---

> 📋 게임 룰 상세: [GAME_RULES.md](./src/data/rules/GAME_RULES.md)

## 미리보기

![메인화면](./docs/screenshots/main.png)
![마켓페이지](./docs/screenshots/market.png)
![업적팝업](./docs/screenshots/achievement.png)

---
