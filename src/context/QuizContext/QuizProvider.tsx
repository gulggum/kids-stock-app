import { ScoreProvider } from "./ScoreContext";
import { QuizProgressProvider } from "./QuizProgressContext";

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScoreProvider>
      <QuizProgressProvider>{children}</QuizProgressProvider>
    </ScoreProvider>
  );
};
