/**
 * 🧠 퀴즈 진행 상태 관리
 * - 어떤 퀴즈를 이미 풀었는지 기록
 * - 중복 보상 방지용
 */

import { createContext, useContext, useState } from "react";
import { useReward } from "../RewardContext";

type QuizProgressContextType = {
  solvedQuizIds: string[];
  isSolved: (quizId: string) => boolean;
  markSolved: (quizId: string) => boolean;
};

const QuizProgressContext = createContext<QuizProgressContextType>(
  {} as QuizProgressContextType,
);

export const QuizProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { giveReward } = useReward(); //중앙 보상 시스템
  const [solvedQuizIds, setSolvedQuizIds] = useState<string[]>([]);

  //이미 푼 퀴즈인지 확인만
  const isSolved = (quizId: string) => {
    return solvedQuizIds.includes(quizId);
  };
  //퀴즈 완료 처리
  const markSolved = (quizId: string) => {
    if (solvedQuizIds.includes(quizId)) return false;

    setSolvedQuizIds((prev) => [...prev, quizId]);

    giveReward("QUIZ_CORRECT");

    return true;
  };

  return (
    <QuizProgressContext.Provider
      value={{ solvedQuizIds, isSolved, markSolved }}
    >
      {children}
    </QuizProgressContext.Provider>
  );
};

export const useQuizProgress = () => useContext(QuizProgressContext);
