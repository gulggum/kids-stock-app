import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../utils/supabase";
import { LEVEL_RULES, type LevelTier } from "../data/rules/levelTitles";
import { getDateKey } from "../utils/date";
import type { RewardType } from "../data/rules/rewardRules";
import type { ProfileAvatarType } from "../data/static/profileAvatars";
import { getLevelTier } from "../utils/getLevelTier";

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
  dollars: number; // 달러 잔액 (미국 주식 구매용)

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

  totalKnowledge: number; //오늘의 지식
  equippedHouseId: string;
  villageX?: number | null;
  villageY?: number | null;

  adCount: number; // 오늘 광고 시청 횟수
  adDate: string | null; // 마지막 광고 시청 날짜 (YYYY-MM-DD)

  premiumInterest: boolean | null; //설문조사
};

type ExpInfo = {
  level: number;
  title: string;
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
  startGuest: (nickname: string) => Promise<{ error: string | null }>; //게스트로그인(로컬에만 저장)

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
  addDollars: (amount: number) => void;
  spendDollars: (amount: number) => boolean;
  exchangeToUsd: (krw: number, dollars: number) => void; // 원화→달러
  exchangeToKrw: (dollars: number, krw: number) => void; // 달러→원화

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
  coin: 300,
  money: 0,
  dollars: 0,
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
  totalKnowledge: 0,
  equippedHouseId: "house_basic",
  adCount: 0,
  adDate: null,
  premiumInterest: null,
};

// ─────────────────────────────────────────
// 📌 Context 생성
// ─────────────────────────────────────────

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ 로그인 상태
  const [isLoading, setIsLoading] = useState(true); // 처음엔 세션 확인 중
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState<User>(defaultUser);

  const currentUserIdRef = useRef("");
  const isLoadingRef = useRef(false);

  // ─────────────────────────────────────────
  // ✅ 앱 시작 시 Supabase 세션 확인
  // 새로고침해도 로그인 유지되는 핵심 로직
  // ─────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      isLoadingRef.current = true;

      const timeout = setTimeout(async () => {
        if (isLoadingRef.current) {
          console.warn("로딩 타임아웃 — 강제 해제");
          isLoadingRef.current = false;
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user) {
            await loadUserFromDB(session.user.id);
          } else {
            setIsLoading(false);
            setIsLoggedIn(false);
          }
        }
      }, 10000);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserFromDB(session.user.id);
        } else {
          setUser(defaultUser);
          setIsLoggedIn(false);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("initAuth 에러:", err);
        setIsLoading(false);
      } finally {
        clearTimeout(timeout);
      }
    };

    initAuth();

    // 앱 복귀 시 빠른 세션 체크 (백그라운드 → 포그라운드)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && !isLoadingRef.current) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          if (currentUserIdRef.current !== session.user.id) {
            await loadUserFromDB(session.user.id);
          } else if (!isLoggedIn) {
            // 같은 유저인데 로그인 상태가 false면 다시 로드
            await loadUserFromDB(session.user.id);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED" && session?.user) {
        // 토큰 갱신 시 로딩 중이면 재시도
        if (isLoadingRef.current) {
          await loadUserFromDB(session.user.id);
        }
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        if (currentUserIdRef.current !== session.user.id || !isLoggedIn) {
          await loadUserFromDB(session.user.id);
        }
      }

      if (event === "SIGNED_OUT") {
        currentUserIdRef.current = "";
        setUser(defaultUser);
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ─────────────────────────────────────────
  // ✅ DB에서 유저 데이터 불러오기
  // 로그인 성공 시 호출됨
  // ─────────────────────────────────────────
  const loadUserFromDB = async (userId: string) => {
    try {
      setIsLoading(true);
      isLoadingRef.current = true; //타임아웃 감지용 — 로딩 시작 신호
      currentUserIdRef.current = userId; // stale closure 방지 — 항상 최신 userId 추적

      // ✅ 병렬 fetch — 4개 쿼리 동시 실행 (순차 대비 ~3배 빠름)
      const [
        { data: profile, error: profileError },
        { data: wallet, error: walletError },
        { data: newsLogs, error: newsLogError },
        { count: totalKnowledge },
        { data: houseData },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase
          .from("wallets")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("user_news_log")
          .select("news_id")
          .eq("user_id", userId)
          .eq("quiz_done", true),
        supabase
          .from("user_knowledge_log")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("user_house_frames")
          .select("frame_id")
          .eq("user_id", userId)
          .eq("is_equipped", true)
          .maybeSingle(),
      ]);

      // last_active는 fire-and-forget (로딩 안 막음)
      supabase
        .from("profiles")
        .update({ last_active: new Date().toISOString() })
        .eq("id", userId);

      if (profileError) console.error("profile error:", profileError);
      if (walletError) console.error("wallet error:", walletError);
      if (newsLogError) console.error("newsLog error:", newsLogError);

      const solvedQuizIds = newsLogs?.map((log) => log.news_id) ?? [];

      // ✅ DB가 source of truth — 로컬 병합 제거
      setUser({
        ...defaultUser,
        id: userId,
        nickname: profile?.nickname ?? "유저",
        role: profile?.role ?? "user",
        money: wallet?.balance ?? 1000000,
        dollars: wallet?.dollars ?? 0,
        profileAvatar: profile?.avatar ?? null,
        profileImage: profile?.profile_image ?? "",
        ownedSkins: profile?.owned_skins ?? ["basic"],
        selectedSkin: profile?.selected_skin ?? "basic",
        status: profile?.status ?? "😄 오늘은 지켜보는 날이에요",
        score: profile?.score ?? 0,
        level: profile?.level ?? 1,
        coin: profile?.coin ?? 300,
        exp: profile?.exp ?? 0,
        totalKnowledge: totalKnowledge ?? 0,
        attendance: profile?.attendance ?? [],
        streak: profile?.streak ?? 0,
        quizProgress: solvedQuizIds,
        achievements: profile?.achievements ?? [],
        equippedHouseId: houseData?.frame_id ?? "house_basic",
        adCount: profile?.ad_count ?? 0,
        adDate: profile?.ad_date ?? null,
        premiumInterest: profile?.premium_interest ?? null,
      });

      setIsLoggedIn(true);
    } catch (err) {
      console.error("loadUserFromDB 에러:", err);
      setUser(defaultUser);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  // ✅ 게스트 시작
  const startGuest = async (
    nickname: string,
  ): Promise<{ error: string | null }> => {
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
        coin: 300,
      }));
      setIsLoggedIn(true); // 게스트도 로그인 상태로 처리
      return { error: null };
    }
    // ✅ profiles에 닉네임 저장
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        nickname,
        role: "user",
      })
      .eq("id", anonymousUser.id);

    if (profileError?.code === "23505") {
      await supabase.auth.signOut();
      return { error: "이미 사용 중인 닉네임이에요" };
    }

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
      coin: 300,
    }));

    setIsLoggedIn(true);
    return { error: null };
  };

  // ─────────────────────────────────────────
  // ✅ 회원가입
  // ─────────────────────────────────────────
  const signUp = async (email: string, password: string, nickname: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname }, // 트리거에서 이걸 읽어서 profiles + wallets 자동 생성
      },
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  // ─────────────────────────────────────────
  // ✅ 로그인
  // ─────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
    setUser((prev) => {
      const newCoin = prev.coin - amount;
      if (prev.id && prev.id !== "guest") {
        supabase
          .from("profiles")
          .update({ coin: newCoin })
          .eq("id", prev.id)
          .then(({ error }) => {
            if (error) console.error("coin 저장 실패:", error);
          });
      }
      return { ...prev, coin: newCoin };
    });
    return true;
  };
  const addCoin = (amount: number) => {
    setUser((prev) => {
      const newCoin = prev.coin + amount;
      if (prev.id && prev.id !== "guest") {
        supabase
          .from("profiles")
          .update({ coin: newCoin })
          .eq("id", prev.id)
          .then(({ error }) => {
            if (error) console.error("coin 저장 실패:", error);
          });
      }
      return { ...prev, coin: newCoin };
    });
  };

  const addExp = (amount: number) => {
    setUser((prev) => {
      const newExp = prev.exp + amount;
      const newLevel =
        LEVEL_RULES.slice()
          .reverse()
          .find((rule) => newExp >= rule.requiredExp)?.level || 1;

      // Supabase 백그라운드 저장 (Optimistic Update)
      if (prev.id) {
        supabase
          .from("profiles")
          .update({ level: newLevel, exp: newExp })
          .eq("id", prev.id)
          .then(({ error }) => {
            if (error) console.error("level/exp 저장 실패:", error);
          });
      }

      return { ...prev, exp: newExp, level: newLevel };
    });
  };

  const addScore = (amount: number) => {
    setUser((prev) => {
      const newScore = prev.score + amount;

      // Supabase 백그라운드 저장 (Optimistic Update)
      if (prev.id && prev.id !== "guest") {
        supabase
          .from("profiles")
          .update({ score: newScore })
          .eq("id", prev.id)
          .then(({ error }) => {
            if (error) console.error("score 저장 실패:", error);
          });
      }

      return { ...prev, score: newScore };
    });
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
        title: currentRule.title,
        currentExp: 0,
        neededExp: 1,
        progress: 100,
      };
    const currentLevelExp = user.exp - currentRule.requiredExp;
    const neededExp = nextRule.requiredExp - currentRule.requiredExp;
    return {
      level: currentRule.level,
      title: currentRule.title,
      currentExp: currentLevelExp,
      neededExp,
      progress: (currentLevelExp / neededExp) * 100,
    };
  })();

  const addAchievement = (id: string) => {
    setUser((prev) => {
      if (prev.achievements.includes(id)) return prev;

      const updated = [...prev.achievements, id]; //새로운배열

      // ✅ Supabase에도 저장
      if (prev.id) {
        supabase
          .from("profiles")
          .update({ achievements: updated })
          .eq("id", prev.id)
          .then(({ error }) => {
            if (error) console.error("achievements 저장 실패:", error);
          });
      }

      return { ...prev, achievements: updated };
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
          .eq("user_id", prev.id)
          .then(({ error }) => {
            if (error) console.error("원화 저장 실패:", error);
          });
      }
      return { ...prev, money: newBalance };
    });
  };
  //환전함수
  const addDollars = (amount: number) => {
    setUser((prev) => {
      const newDollars = (prev.dollars ?? 0) + amount;

      // 로그인 상태면 DB도 업데이트
      if (isLoggedIn && prev.id) {
        supabase
          .from("wallets")
          .update({ dollars: newDollars })
          .eq("user_id", prev.id)
          .then(({ error }) => {
            if (error) console.error("dollars 저장 실패:", error);
          });
      }
      return { ...prev, dollars: newDollars };
    });
  };

  const spendDollars = (amount: number): boolean => {
    if ((user.dollars ?? 0) < amount) return false;
    setUser((prev) => {
      const newDollars = (prev.dollars ?? 0) - amount;
      if (isLoggedIn && prev.id) {
        supabase
          .from("wallets")
          .update({ dollars: newDollars })
          .eq("user_id", prev.id)
          .then(({ error }) => {
            if (error) console.error("dollars 저장 실패:", error);
          });
      }
      return { ...prev, dollars: newDollars };
    });
    return true;
  };

  // 원화 → 달러 환전
  const exchangeToUsd = (krw: number, dollars: number) => {
    spendMoney(krw);
    addDollars(dollars);
  };

  // 달러 → 원화 환전
  const exchangeToKrw = (dollars: number, krw: number) => {
    spendDollars(dollars);
    addMoney(krw);
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
          .eq("user_id", prev.id)
          .then(({ error }) => {
            if (error) console.error("원화 저장 실패:", error);
          });
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

    const newAttendance = [...user.attendance, today];
    setUser((prev) => ({
      ...prev,
      attendance: [...prev.attendance, today],
      streak: nextStreak,
    }));

    if (user.id && user.id !== "guest") {
      supabase
        .from("profiles")
        .update({ attendance: newAttendance, streak: nextStreak })
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("출석 저장 실패:", error);
        });
    }
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

    // 1️⃣ UI 즉시 업데이트 (빠른 UI 반응)
    setUser((prev) => ({
      ...prev,
      quizProgress: [...prev.quizProgress, quizId],
    }));

    // 2️⃣ Supabase user_news_log 저장 (비동기 — UI 안 막음)
    if (user.id) {
      const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      supabase
        .from("user_news_log")
        .upsert(
          {
            user_id: user.id,
            news_id: quizId,
            read: true,
            quiz_done: true,
            rewarded: true,
            date: today,
          },
          { onConflict: "user_id,news_id" },
        )
        .then(({ error }) => {
          if (error) console.error("user_news_log 저장 실패:", error);
        });
    }

    // 3️⃣ 리워드 지급
    giveReward("QUIZ_CORRECT");
    return true;
  };

  const updateStatus = (status: string) => {
    setUser((prev) => ({ ...prev, status }));

    // ✅ Supabase 저장
    if (user.id && user.id !== "guest") {
      supabase
        .from("profiles")
        .update({ status })
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("상태 저장 실패:", error);
        });
    }
  };

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
        addDollars,
        spendDollars,
        exchangeToUsd,
        exchangeToKrw,
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
