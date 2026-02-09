이 폴더는 키즈스톡 앱에서 사용하는 데이터들을 역할별로 분리해 관리합니다.
화면용 더미 데이터, 고정 콘텐츠, 시스템 규칙을 명확히 나누는 것이 목적

mock/ - 화면용 더미 데이터
├── chartMock.ts // 주가 차트 더미 데이터
├── communityMock.ts // 커뮤니티 사용자 더미
├── homeNews.ts // 뉴스 카드 데이터
└── newsQuiz.ts // 뉴스 퀴즈 데이터

static/ - 고정 콘텐츠 데이터
├── badges.ts // 뱃지 메타 정보
├── characterItems.ts // 캐릭터 아이템 정보
├── companyMeta.ts // 회사 기본 정보
└── companyExplain.ts // 아이 눈높이 설명 문구

rules/ - 앱의 동작을 결정하는 판단·계산 규칙 데이터

├── levelRules.ts // 레벨 → 칭호 판정
├── missionRules.ts // 활동 점수 규칙
├── attendanceRules.ts // 출석/연속 출석 규칙
└── badgeRules.ts // 뱃지 자동 지급 조건
