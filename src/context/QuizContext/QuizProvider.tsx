import { QuizProgressProvider } from "./QuizProgressContext";

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  return <QuizProgressProvider>{children}</QuizProgressProvider>;
};
