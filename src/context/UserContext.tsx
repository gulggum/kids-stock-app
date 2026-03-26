//CharacterContext,ScoreContext 정리예정

import { createContext, useContext, useEffect, useState } from "react";
import { getStorage, setStorage } from "../utils/storage";
import { LEVEL_RULES } from "../data/rules/levelTitles";
import { getDateKey } from "../utils/date";
import type { RewardType } from "../data/rules/rewardRules";
import type { ProfileAvatarType } from "../data/static/profileAvatars";

/**
 * 📌 localStorage 키
 * - 유저 데이터를 브라우저에 저장해서 새로고침해도 유지
 */
const USER_KEY = "user";

/**
 * 🧍‍♂️ 유저 전체 데이터 타입 (🔥 핵심)
 *
 * 👉 이 객체 하나가 "서버에서 내려오는 유저 데이터"라고 생각하면 됨
 */
export type User = {
  id: number; // 유저 ID
  nickname: string; // 닉네임

  level: number; // 레벨
  exp: number; // 경험치
  score: number; // 점수

  coin: number; // 코인 (아이템용)
  money: number; // 투자금

  ownedSkins: string[]; // 보유 스킨
  selectedSkin: string; // 선택 스킨

  ownedItems: string[]; // 보유 아이템
  equippedItems: Record<string, string>; // 착용 아이템

  stocks: number[]; // 보유 주식 (id 목록)

  achievements: string[]; // 업적목록
  badges: string[]; // 뱃지

  attendance: string[]; // 출석한 날짜 목록
  streak: number; //연속 출석 일 수
  quizProgress: string[]; // 푼 퀴즈 ID 목록

  friends: number[]; // 친구 목록 (id)
  status: string; // 한줄 상태

  profileImage: string | null; // 프로필 이미지
  profileAvatar: ProfileAvatarType | null; // 기본 아바타
};

type ExpInfo = {
  level: number;
  currentExp: number;
  neededExp: number;
  progress: number;
};
/**
 * 📦 Context에서 제공할 값들
 */
type UserContextType = {
  /** 현재 유저 데이터 */
  user: User;

  /** 유저 전체 업데이트 */
  setUser: React.Dispatch<React.SetStateAction<User>>;

  /** 경험치 추가 */
  addExp: (amount: number) => void; // 경험치 추가
  addScore: (amount: number) => void; // 점수 추가

  /** 코인 사용 void는 항상성공, boolean은 실패 가능성여부 */
  spendCoin: (amount: number) => boolean; // 코인 사용
  addCoin: (amount: number) => void; // 코인 추가

  currentTitle: string; // 칭호
  expProgress: number; // 경험치 %게이지
  expInfo: ExpInfo;

  addAchievement: (id: string) => void; //업적리스트추가

  //가상머니
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;

  //출석관련
  // giveReward를 파라미터로 받는 이유:
  // UserContext에서 useReward를 직접 쓰면 순환 참조 발생
  // → 호출하는 쪽에서 giveReward 주입 ex) checkToday(giveReward)
  checkToday: (giveReward: (type: RewardType) => void) => void;
  isCheckedToday: boolean;
  //퀴즈관련
  // 동일한 이유로 giveReward 파라미터로 주입
  // ex) markSolved(quizId, giveReward)
  isSolved: (quizId: string) => boolean;
  markSolved: (
    quizId: string,
    giveReward: (type: RewardType) => void,
  ) => boolean;
};

/**
 * 📌 Context 생성
 */

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultUser: User = {
    id: 1,
    nickname: "가온",
    level: 1,
    exp: 0,
    score: 0,

    coin: 1000, //개발용
    money: 1000000, //개발용

    ownedSkins: ["basic"],
    selectedSkin: "basic",

    ownedItems: [],
    equippedItems: {},

    stocks: [],

    achievements: [],
    badges: [],

    attendance: [],
    streak: 0,
    quizProgress: [],

    friends: [],
    status: "🙂 초보 투자자",

    profileImage: null,
    profileAvatar: null,
  };
  /**
   * 🔥 storage에서 불러오기
   */
  const [user, setUser] = useState<User>(() =>
    getStorage(USER_KEY, defaultUser),
  );

  /**
   * 🔥 코인 차감
   */
  const spendCoin = (amount: number) => {
    if (user.coin < amount) return false;

    setUser((prev) => ({
      ...prev,
      coin: prev.coin - amount,
    }));

    return true;
  };

  /**
   * 🔥 코인 추가
   */
  const addCoin = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      coin: prev.coin + amount,
    }));
  };
  /**
   * 📈 경험치 추가 + 레벨 자동 계산
   */
  const addExp = (amount: number) => {
    setUser((prev) => {
      const newExp = prev.exp + amount;

      // 🔥 현재 경험치 기준으로 칭호 계산
      const newLevel =
        LEVEL_RULES.slice()
          .reverse()
          .find((rule) => newExp >= rule.requiredExp)?.level || 1;

      return {
        ...prev,
        exp: newExp,
        level: newLevel,
      };
    });
  };

  /**
   * 🏆 점수 추가
   */
  const addScore = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      score: prev.score + amount,
    }));
  };

  /**
   * 🏷 현재 칭호 계산
   */
  const currentTitle =
    LEVEL_RULES.slice()
      .reverse()
      .find((rule) => user.exp >= rule.requiredExp)?.title || "🐣 투자 새싹";

  /**
   * 📊 경험치 진행률 (%) //게이지 채우는용도 ((progress %) = 현재레벨에서 쌓은 경험치 / 다음레벨까지 필요한 경험치)
   */
  const expProgress = (() => {
    const currentRule =
      LEVEL_RULES.slice()
        .reverse()
        .find((r) => user.exp >= r.requiredExp) ?? LEVEL_RULES[0];

    const nextRule = LEVEL_RULES.find((r) => r.level === currentRule.level + 1);

    if (!nextRule) return 100;

    const currentLevelExp = user.exp - currentRule.requiredExp;
    const neededExp = nextRule.requiredExp - currentRule.requiredExp;

    return (currentLevelExp / neededExp) * 100;
  })();

  // 경험치 UI용
  //   level,  // 현재 레벨
  //   currentExp  // 현재 레벨에서 쌓은 경험치
  //   neededExp  // 다음 레벨까지 필요한 경험치
  //   progress  // 퍼센트 (기존 expProgress)
  const expInfo = (() => {
    const currentRule =
      LEVEL_RULES.slice()
        .reverse()
        .find((r) => user.exp >= r.requiredExp) ?? LEVEL_RULES[0];

    const nextRule = LEVEL_RULES.find((r) => r.level === currentRule.level + 1);

    if (!nextRule) {
      return {
        level: currentRule.level,
        currentExp: 0,
        neededExp: 1,
        progress: 100,
      };
    }

    const currentLevelExp = user.exp - currentRule.requiredExp;
    const neededExp = nextRule.requiredExp - currentRule.requiredExp;

    return {
      level: currentRule.level,
      currentExp: currentLevelExp,
      neededExp,
      progress: (currentLevelExp / neededExp) * 100,
    };
  })();

  /**
   * 🏆 업적 추가
   */
  const addAchievement = (id: string) => {
    setUser((prev) => {
      if (prev.achievements.includes(id)) return prev;

      return {
        ...prev,
        achievements: [...prev.achievements, id],
      };
    });
  };

  // 💰 머니 추가
  const addMoney = (amount: number) => {
    setUser((prev) => ({ ...prev, money: prev.money + amount }));
  };

  // 💰 머니 차감 (부족하면 false)
  const spendMoney = (amount: number): boolean => {
    if (user.money < amount) return false;
    setUser((prev) => ({ ...prev, money: prev.money - amount }));
    return true;
  };

  const today = getDateKey(); // import { getDateKey } from "../../utils/date"

  const getYesterdayKey = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getDateKey(d);
  };

  // ✅ giveReward를 파라미터로 받음 (순환 참조 방지)
  // 사용하는 곳에서: checkToday(giveReward)
  const checkToday = (giveReward: (type: RewardType) => void) => {
    if (user.attendance.includes(today)) return; // 이미 출석했으면 리턴

    const yesterday = getYesterdayKey();
    const nextStreak = user.attendance.includes(yesterday)
      ? user.streak + 1
      : 1;

    setUser((prev) => ({
      ...prev,
      attendance: [...prev.attendance, today],
      streak: nextStreak,
    }));

    giveReward("ATTENDANCE_DAILY");

    if (nextStreak % 7 === 0) {
      giveReward("ATTENDANCE_STREAK_7");
    }
  };
  // 오늘 출석 여부 (UI 버튼 비활성화용)
  const isCheckedToday = user.attendance.includes(today);
  // ─── 퀴즈 ────────────────────────────────
  // 이미 푼 퀴즈인지 확인
  const isSolved = (quizId: string) => user.quizProgress.includes(quizId);

  // 퀴즈 완료 처리 + 보상 지급
  const markSolved = (
    quizId: string,
    giveReward: (type: RewardType) => void,
  ): boolean => {
    if (user.quizProgress.includes(quizId)) return false; // 이미 푼 퀴즈

    setUser((prev) => ({
      ...prev,
      quizProgress: [...prev.quizProgress, quizId],
    }));

    giveReward("QUIZ_CORRECT");
    return true;
  };

  /**
   * 💾 저장
   */
  useEffect(() => {
    setStorage(USER_KEY, user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        spendCoin,
        addCoin,
        addExp,
        addScore,
        expProgress,
        expInfo,
        currentTitle,
        addAchievement,
        addMoney,
        spendMoney,
        checkToday,
        isCheckedToday,
        isSolved,
        markSolved,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
/**
 * 📌 커스텀 훅
 * - 어디서든 쉽게 user 접근 가능
 */
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};
