
import { Paper } from "@/backend/types"
import { Dispatch, SetStateAction } from "react";

type Props = {
  paper: Paper,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
  setSelectedPaper: Dispatch<SetStateAction<Paper | null>>
}

const QuizCard = ({paper, setIsModalOpen, setSelectedPaper}: Props) => {
  const handleClick = ()=>{
    setIsModalOpen(true)
    setSelectedPaper(paper)
  }
  return (
    <div className="w-1/4">
    <div style={{backgroundColor: paper.color}} className={`flex bg-[#EEE] rounded-xl h-36 px-4 justify-between`}>
      <div className="flex flex-col justify-around w-1/2">
        <h2 className="text-black text-2xl font-semibold">
            {paper.name}
        </h2>
        <div className="bg-colororange rounded-xl text-center text-white">
          Total {paper.questions?.length}
        </div>
      </div>
      <div className="flex flex-col items-center justify-around">
        <button onClick={handleClick} className="bg-[#01B067] rounded-md text-sm text-white px-7 py-0.5 m-0">Start</button>
        <img src="/assets/img/icon56.png" alt="image" />
      </div>
    </div>
  </div>
  )
}

export default QuizCard