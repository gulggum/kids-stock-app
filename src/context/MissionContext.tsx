import { createContext, useContext, useState } from "react";

type MissionContextType = {
  score: number;
  addScore: (amount: number) => void;
};

const MissionContext = createContext<MissionContextType>(
  {} as MissionContextType,
);

export const MissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [score, setScore] = useState(0);

  const addScore = (amount: number) => {
    setScore((prev) => prev + amount);
  };

  return (
    <MissionContext.Provider value={{ score, addScore }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => useContext(MissionContext);
