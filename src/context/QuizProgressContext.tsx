/**
 * 🧠 퀴즈 진행 상태 관리
 * - 어떤 퀴즈를 이미 풀었는지 기록
 * - 중복 보상 방지용
 */

import { createContext, useContext, useState } from "react";
import { useScore } from "./ScoreContext";
import { useCoin } from "./Coin&Money/CoinContext";
import { useCharacter } from "./CharacterContext";
import {
  COIN_REWARD,
  EXP_REWARD,
  SCORE_REWARD,
} from "../data/rules/rewardRules";

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

  const { addCoin } = useCoin();
  const { addScore } = useScore();
  const { addExp } = useCharacter();

  //이미 춘 퀴즈인지 확인만
  const isSolved = (quizId: string) => {
    return solvedQuizIds.includes(quizId);
  };
  //퀴즈를 푼 것으로  기록
  const markSolved = (quizId: string) => {
    if (solvedQuizIds.includes(quizId)) return false;

    setSolvedQuizIds((prev) => [...prev, quizId]);

    //보상 지급 ( rule 기준 )
    addCoin(COIN_REWARD.QUIZ_CORRECT);
    addExp(EXP_REWARD.QUIZ_CORRECT);
    addScore(SCORE_REWARD.QUIZ_CORRECT);
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
