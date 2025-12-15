"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface QuizContextType {
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizContextProvider = ({ children }: { children: ReactNode }) => {
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);

  return (
    <QuizContext.Provider value={{ isQuizActive, setIsQuizActive }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizContext must be used within a QuizContextProvider");
  }
  return context;
};

