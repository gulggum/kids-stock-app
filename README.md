# 🪙 KidsStock

> 어린이를 위한 경제 학습 체험 앱

📅 개발 기간: 2026.01.17 ~ 진행 중  
🔗 배포 링크: [kids-stock-app.vercel.app](https://kids-stock-app.vercel.app)

---

## 기획 의도

어린이들이 뉴스와 퀴즈, 가상 경제 활동 체험을 통해  
경제와 기업의 흐름을 쉽고 재미있게 익힐 수 있는 교육형 앱입니다.

하루 5~10분, 오늘의 뉴스를 읽고 퀴즈를 풀고,  
내 기업 카드가 어떻게 변했는지 확인하는 것만으로도  
자연스럽게 경제 감각을 키울 수 있어요.

실제 돈이 아닌 가상 사이버머니로 경제 흐름과  
기다림의 가치를 배우고, 카드스킨 꾸미기·등급별 집 구매·배지 등  
다양한 보상으로 꾸준한 참여를 유도합니다.

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

## 주요 기능

### 📈 경제 마켓

- 한국/미국 기업 데이터 표시 (Yahoo Finance API)
- Vercel Cron으로 하루 1회 자동 데이터 업데이트
- 기업 상세 페이지 (차트 + 아이 눈높이 설명)
- 원화/달러 환전 기능
- 선택 이유 기록 기능

### 💰 포트폴리오

- 보유 기업 카드 목록 및 평균 기록 계산
- 총 자산 실시간 계산 (현금 + 보유 자산)
- 활동 내역 히스토리
- 파산 시 50만원 지원금 지급 후 재시작

### 📰 뉴스 & 퀴즈

- 관리자 페이지에서 뉴스 직접 등록
- 관리자가 ChatGPT로 아이 눈높이 변환 후 직접 업로드
- TanStack Query로 24시간 캐싱
- 뉴스 기반 퀴즈 → 포인트/경험치 보상

### 🎮 게임화 시스템

- 경험치(EXP) 기반 10단계 레벨 시스템
- 레벨별 칭호 (🐣 경제 새싹 → 👑 경제 탐험가)
- 22개 업적 (COMMON / RARE / LEGEND 티어)
- 매일 출석 + 연속 출석 보너스
- 오늘의 지식 보상

### 🏠 집 시스템

- 레벨 달성 + 포인트로 집 구매
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

## 아키텍처

### 상태관리 구조

Context
├── UserContext → 유저 정보 단일 출처 (exp, point, level 등)
├── TradeContext → 활동 기록 원본
├── PortfolioContext → 활동 기록 기반 파생 데이터
├── RewardContext → 보상 지급 단일 창구
├── AchievementContext → 업적 조건 감시 + 보상 지급
├── QuizContext → 퀴즈 상태
└── UIContext → 모달 / 토스트 등 UI 상태

### Custom Hooks

페이지 컴포넌트는 UI만 담당하고 비즈니스 로직은 훅으로 분리했습니다.

- useStockDetail → 상세 페이지 로직 전담
- useHouse → 집 구매/착용, spendCoin 재사용으로 중복 제거
- useRankingQuery / useStocksQuery / useNewsQuery → TanStack Query 캐싱 전략
- useExchangeRate → 실시간 환율 조회

### Supabase 테이블 구조

profiles → 유저 정보 (레벨, 포인트, 업적, 마을 위치 등)
wallets → 자산 (원화, 달러)
trades → 활동 내역
stocks → 기업 데이터
news → 뉴스 + AI 변환 결과
news_quizzes → 뉴스 퀴즈
user_news_log → 뉴스/퀴즈 이력
user_knowledge_log→ 오늘의 지식 이력
exchange_history → 환전 내역
house_frames → 집 카탈로그
user_house_frames → 유저 구매/착용 집
inquiries → 문의하기

### Vercel Serverless Functions

api/update-stocks.ts → 기업 데이터 업데이트 (Cron)

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
- 하루 기본 플레이 시 약 80~100 포인트 획득
- 집 가격은 레벨 도달 시 구매 가능한 수준으로 설계

## 개발 기록

개발기록은 [Velog 키즈스톡 개발일지](https://velog.io/@gulggum/series/StockKids%EA%B0%9C%EB%B0%9C)에서 확인할 수 있습니다.

📋 게임 룰 상세: [GAME_RULES.md](./src/data/rules/GAME_RULES.md)
