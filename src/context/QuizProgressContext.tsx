/**
 * 🧠 퀴즈 진행 상태 관리
 * - 어떤 퀴즈를 이미 풀었는지 기록
 * - 중복 보상 방지용
 */

import { createContext, useContext, useState } from "react";

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
  const [solvedQuizIds, setSolvedQuizIds] = useState<string[]>([]);

  //이미 춘 퀴즈인지 확인만
  const isSolved = (quizId: string) => {
    return solvedQuizIds.includes(quizId);
  };
  //퀴즈를 푼 것으로  기록
  const markSolved = (quizId: string) => {
    setSolvedQuizIds((prev) => {
      if (prev.includes(quizId)) return prev;
      return [...prev, quizId];
    });
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
