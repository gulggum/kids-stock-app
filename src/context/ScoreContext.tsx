import { createContext, useContext, useEffect, useState } from "react";

const SCORE_KEY = "score";

type ScoreContextType = {
  score: number;
  addScore: (amount: number) => void;
};

const ScoreContext = createContext<ScoreContextType>({} as ScoreContextType);

export const ScoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem(SCORE_KEY);
    return saved ? Number(saved) : 0;
  });

  const addScore = (amount: number) => {
    setScore((prev) => prev + amount);
  };

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, String(score));
  }, [score]);

  return (
    <ScoreContext.Provider value={{ score, addScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);
