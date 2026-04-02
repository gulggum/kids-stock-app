// CharacterContext, ScoreContext 정리예정

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { getStorage, setStorage } from "../utils/storage";
import { LEVEL_RULES, type LevelTier } from "../data/rules/levelTitles";
import { getDateKey } from "../utils/date";
import type { RewardType } from "../data/rules/rewardRules";
import type { ProfileAvatarType } from "../data/static/profileAvatars";
import { getLevelTier } from "../utils/getLevelTier";

const USER_KEY = "user";

// ─────────────────────────────────────────
// 📌 타입 정의
// ─────────────────────────────────────────

/**
 * 🧍 유저 전체 데이터 타입
 * id가 number → string(UUID)으로 변경됨
 * Supabase auth.users의 id와 동일한 UUID(고유식별자) 사용
 */
export type User = {
  id: string; // ✅ Supabase UUID (기존 number에서 변경)
  nickname: string;
  role: "user" | "admin"; // ✅ Supabase profiles의 role

  level: number;
  exp: number;
  score: number;

  coin: number;
  money: number; // ✅ Supabase wallets의 balance와 동기화

  ownedSkins: string[];
  selectedSkin: string;

  ownedItems: string[];
  equippedItems: Record<string, string>;

  stocks: number[];

  achievements: string[];
  badges: string[];

  attendance: string[];
  streak: number;
  quizProgress: string[];

  friends: string[];
  status: string;

  profileImage: string | null;
  profileAvatar: ProfileAvatarType | null;

  hasBankrupt: boolean;
};

type ExpInfo = {
  level: number;
  currentExp: number;
  neededExp: number;
  progress: number;
};

/**
 * 📦 Context에서 제공할 값들
 * ✅ 추가: isLoading, isLoggedIn, signUp, signIn, signOut
 */
type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  startGuest: (nickname: string) => Promise<void>; //게스트로그인(로컬에만 저장)

  // ✅ 새로 추가 — 로그인 상태
  isLoading: boolean; // 세션 확인 중인지 (앱 첫 로드 시)
  isLoggedIn: boolean; // 로그인 여부

  // ✅ 새로 추가 — 인증 함수
  signUp: (
    email: string,
    password: string,
    nickname: string,
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;

  addExp: (amount: number) => void;
  addScore: (amount: number) => void;

  spendCoin: (amount: number) => boolean;
  addCoin: (amount: number) => void;

  currentTitle: string;
  currentTier: LevelTier;
  expProgress: number;
  expInfo: ExpInfo;

  addAchievement: (id: string) => void;

  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;

  checkToday: (giveReward: (type: RewardType) => void) => void;
  isCheckedToday: boolean;

  isSolved: (quizId: string) => boolean;
  markSolved: (
    quizId: string,
    giveReward: (type: RewardType) => void,
  ) => boolean;

  updateStatus: (status: string) => void;
};

// ─────────────────────────────────────────
// 📌 기본값 (비로그인 상태)
// ─────────────────────────────────────────

const defaultUser: User = {
  id: "",
  nickname: "게스트",
  role: "user",
  level: 1,
  exp: 0,
  score: 0,
  coin: 0,
  money: 0,
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
  status: "😄 오늘은 지켜보는 날이에요",
  profileImage: null,
  profileAvatar: null,
  hasBankrupt: false,
};

// ─────────────────────────────────────────
// 📌 Context 생성
// ─────────────────────────────────────────

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ 로그인 상태
  const [isLoading, setIsLoading] = useState(true); // 처음엔 세션 확인 중
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // localStorage에서 게임 데이터 불러오기 (level, exp 등)
  const [user, setUser] = useState<User>(() =>
    getStorage(USER_KEY, defaultUser),
  );

  // ─────────────────────────────────────────
  // ✅ 앱 시작 시 Supabase 세션 확인
  // 새로고침해도 로그인 유지되는 핵심 로직
  // ─────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserFromDB(session.user.id);
        }
      } catch (err) {
        console.error("initAuth 에러:", err);
      } finally {
        setIsLoading(false); // ✅ 성공이든 실패든 무조건 false
      }
    };

    initAuth();

    // 로그인/로그아웃 상태 변화 감지
    // 다른 탭에서 로그아웃해도 자동 반영됨
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await loadUserFromDB(session.user.id);
      }
      if (event === "SIGNED_OUT") {
        setUser(defaultUser);
        setIsLoggedIn(false);
      }
    });

    // 컴포넌트 언마운트 시 구독 해제 (메모리 누수 방지)
    return () => subscription.unsubscribe();
  }, []);

  // ─────────────────────────────────────────
  // ✅ DB에서 유저 데이터 불러오기
  // 로그인 성공 시 호출됨
  // ─────────────────────────────────────────
  const loadUserFromDB = async (userId: string) => {
    try {
      setIsLoading(true); // 🔥 시작
      // profiles 테이블에서 닉네임, 역할 가져오기
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // wallets 테이블에서 잔액 가져오기
      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profile) {
        // localStorage의 게임 데이터 + DB의 프로필/머니 합치기
        const savedGameData = getStorage(USER_KEY, defaultUser);

        setUser({
          ...savedGameData, // level, exp, 출석 등 기존 게임 데이터 유지
          id: userId, // DB의 UUID
          nickname: profile.nickname,
          role: profile.role,
          money: wallet?.balance ?? 1000000, // DB 잔액 (없으면 기본값)
        });

        setIsLoggedIn(true);
        console.log("프로파일도?", profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      console.log("마침내 여기왔다");
      setIsLoading(false); // 🔥 끝 (이게 핵심)
    }
  };

  // ✅ 게스트 시작 (localStorage에만 저장)
  const startGuest = async (nickname: string) => {
    // ✅ Supabase 익명 계정 생성
    const { data, error } = await supabase.auth.signInAnonymously();
    const anonymousUser = data?.user;

    if (error || !anonymousUser) {
      // 익명 로그인 실패 시 기존 방식으로 폴백
      setUser((prev) => ({
        ...prev,
        id: "guest",
        nickname,
        role: "user",
        money: 1000000,
        coin: 1000,
      }));
      setIsLoggedIn(true); // 게스트도 로그인 상태로 처리
      return;
    }
    // ✅ profiles에 닉네임 저장
    await supabase.from("profiles").upsert({
      id: anonymousUser.id,
      nickname,
      role: "user",
    });

    // ✅ wallets 생성
    await supabase.from("wallets").upsert({
      user_id: anonymousUser.id,
      balance: 1000000,
    });

    // ✅ 유저 상태 업데이트
    setUser((prev) => ({
      ...prev,
      id: anonymousUser.id,
      nickname,
      role: "user",
      money: 1000000,
      coin: 1000,
    }));

    setIsLoggedIn(true);
  };

  // ─────────────────────────────────────────
  // ✅ 회원가입
  // ─────────────────────────────────────────
  const signUp = async (email: string, password: string, nickname: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname }, // 트리거에서 이걸 읽어서 profiles + wallets 자동 생성
      },
    });

    console.log("signUp data:", data);
    console.log("signUp error:", error);

    if (error) return { error: error.message };
    return { error: null };
  };

  // ─────────────────────────────────────────
  // ✅ 로그인
  // ─────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("signIn data:", data);
    console.log("signIn error:", error);

    if (error) return { error: error.message };
    return { error: null };
  };

  // ─────────────────────────────────────────
  // ✅ 로그아웃
  // ─────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange에서 SIGNED_OUT 감지 → user 초기화
  };

  // ─────────────────────────────────────────
  // 기존 게임 로직 (변경 없음)
  // ─────────────────────────────────────────

  const { title: currentTitle, tier: currentTier } = getLevelTier(user.level);

  const spendCoin = (amount: number) => {
    if (user.coin < amount) return false;
    setUser((prev) => ({ ...prev, coin: prev.coin - amount }));
    return true;
  };

  const addCoin = (amount: number) => {
    setUser((prev) => ({ ...prev, coin: prev.coin + amount }));
  };

  const addExp = (amount: number) => {
    setUser((prev) => {
      const newExp = prev.exp + amount;
      const newLevel =
        LEVEL_RULES.slice()
          .reverse()
          .find((rule) => newExp >= rule.requiredExp)?.level || 1;
      return { ...prev, exp: newExp, level: newLevel };
    });
  };

  const addScore = (amount: number) => {
    setUser((prev) => ({ ...prev, score: prev.score + amount }));
  };

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

  const expInfo = (() => {
    const currentRule =
      LEVEL_RULES.slice()
        .reverse()
        .find((r) => user.exp >= r.requiredExp) ?? LEVEL_RULES[0];
    const nextRule = LEVEL_RULES.find((r) => r.level === currentRule.level + 1);
    if (!nextRule)
      return {
        level: currentRule.level,
        currentExp: 0,
        neededExp: 1,
        progress: 100,
      };
    const currentLevelExp = user.exp - currentRule.requiredExp;
    const neededExp = nextRule.requiredExp - currentRule.requiredExp;
    return {
      level: currentRule.level,
      currentExp: currentLevelExp,
      neededExp,
      progress: (currentLevelExp / neededExp) * 100,
    };
  })();

  const addAchievement = (id: string) => {
    setUser((prev) => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id] };
    });
  };

  const addMoney = (amount: number) => {
    setUser((prev) => {
      const newBalance = prev.money + amount;
      // ✅ 로그인 상태면 DB도 업데이트
      if (isLoggedIn && prev.id) {
        supabase
          .from("wallets")
          .update({ balance: newBalance })
          .eq("user_id", prev.id);
      }
      return { ...prev, money: newBalance };
    });
  };

  const spendMoney = (amount: number): boolean => {
    if (user.money < amount) return false;
    setUser((prev) => {
      const newBalance =
        prev.money - amount <= 0 ? 500000 : prev.money - amount;
      const isBankrupt = prev.money - amount <= 0;
      // ✅ 로그인 상태면 DB도 업데이트
      if (isLoggedIn && prev.id) {
        supabase
          .from("wallets")
          .update({ balance: newBalance })
          .eq("user_id", prev.id);
      }
      return {
        ...prev,
        money: newBalance,
        hasBankrupt: prev.hasBankrupt || isBankrupt,
      };
    });
    return true;
  };

  const today = getDateKey();

  const getYesterdayKey = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getDateKey(d);
  };

  const checkToday = (giveReward: (type: RewardType) => void) => {
    if (user.attendance.includes(today)) return;
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
    if (nextStreak % 7 === 0) giveReward("ATTENDANCE_STREAK_7");
  };

  const isCheckedToday = user.attendance.includes(today);

  const isSolved = (quizId: string) => user.quizProgress.includes(quizId);

  const markSolved = (
    quizId: string,
    giveReward: (type: RewardType) => void,
  ): boolean => {
    if (user.quizProgress.includes(quizId)) return false;
    setUser((prev) => ({
      ...prev,
      quizProgress: [...prev.quizProgress, quizId],
    }));
    giveReward("QUIZ_CORRECT");
    return true;
  };

  const updateStatus = (status: string) => {
    setUser((prev) => ({ ...prev, status }));
  };

  // ✅ 게임 데이터 localStorage 저장 (기존과 동일)
  useEffect(() => {
    setStorage(USER_KEY, user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        startGuest,
        isLoading,
        isLoggedIn,
        signUp,
        signIn,
        signOut,
        spendCoin,
        addCoin,
        addExp,
        addScore,
        expProgress,
        expInfo,
        currentTitle,
        currentTier,
        addAchievement,
        addMoney,
        spendMoney,
        checkToday,
        isCheckedToday,
        isSolved,
        markSolved,
        updateStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
