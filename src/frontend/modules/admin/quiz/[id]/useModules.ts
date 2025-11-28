import { useRouter } from "next/router";
import { useState } from "react";

export const quizQuestionType = {
  library: "library",
  customLibrary: "customLibrary",
};

export const useModules = () => {
  const [quizType, setQuizType] = useState(quizQuestionType.library);
  const [libraryMode, setLibraryMode] = useState("add");
  const [isAddLibraryModalOpen, setisAddLibraryModalOpen] = useState(false);
  // const [isAddLibraryQuestionsModalOpen, setisAddLibraryQuestionsModalOpen] =
  //   useState(false);
  const [isAddCustomQuestionsModalOpen, setisAddCustomQuestionsModalOpen] =
    useState(false);

  const toggleAddLibraryModal = () => {
    if (isAddLibraryModalOpen) {
      setLibraryMode("add");
    }
    setisAddLibraryModalOpen(!isAddLibraryModalOpen);
  };

  // const toggleAddLibraryQuestionsModal = () =>
  //   setisAddLibraryQuestionsModalOpen(!isAddLibraryQuestionsModalOpen);

  const toggleAddCustomQuestionsModal = () =>
    setisAddCustomQuestionsModalOpen(!isAddCustomQuestionsModalOpen);

  const toggleLibraryViewMode = (mode: string) => {
    setLibraryMode(mode);
  };

  const toggleQuizType = () => {
    if (quizType === quizQuestionType.library) {
      setQuizType(quizQuestionType.customLibrary);
    } else {
      setQuizType(quizQuestionType.library);
    }
  };

  return {
    isAddLibraryModalOpen,
    toggleAddLibraryModal,
    quizType,
    toggleQuizType,
    libraryMode,
    toggleLibraryViewMode,
    // isAddLibraryQuestionsModalOpen,
    // toggleAddLibraryQuestionsModal,
    isAddCustomQuestionsModalOpen,
    toggleAddCustomQuestionsModal,
    setLibraryMode,
  };
};
