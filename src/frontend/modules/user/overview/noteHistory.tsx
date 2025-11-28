"use client";

import { NoteStatus } from "@/backend/types/noteStatus";
import { QuestionStatus } from "@/backend/types/questionStatus";
import Box from "@/frontend/components/box/Box";
import RightSidebar from "@/frontend/components/rightSidebar/RightSidebar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function NoteHistory() {
  const [noteStatuses, setNoteStatuses] = useState<NoteStatus[]>([]);

  const getNoteStatuses = async () => {
    const { data } = await axios.get("/api/users/note-status");
    const sortedStatuses = data.noteStatus.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    setNoteStatuses(sortedStatuses);
  };
  useEffect(() => {
    getNoteStatuses();
  }, []);
  const calculateProgress = (note: NoteStatus) => {
    const totalItems = note.content.length;
    const completedItems = note.content.filter((item) => item.completed).length;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };
  return (
    <>
      <div className="flex gap-10 my-10">
        <div className="flex flex-col w-5/6">
          <div className="flex justify-center pb-5">
            <h2 className="text-3xl">Notes History</h2>
          </div>

          <div className="pt-3">
            <div className="grid grid-cols-2 w-full gap-10">
              {noteStatuses.length > 0 ? (
                noteStatuses.map((note) => (
                  <Box
                    key={note.noteId}
                    title={note.noteName}
                    url={note.url}
                    startedAt={note.createdAt}
                    type="note"
                    className="w-full"
                    completionPercentage={calculateProgress(note)} // Pass progress as a prop
                  />
                ))
              ) : (
                <div>No history!</div>
              )}{" "}
            </div>
          </div>
        </div>

        <RightSidebar />
        {/* <div className="flex flex-col justify-center items-center w-2/6">

                    <div className="flex flex-col items-center py-3">
                        <img className="rounded-full" src="/assets/img/icon35.png" />
                        <p className="text-[#277C72] text-lg font-medium">Jhon Doe</p>
                        <p className="text-sm">ID:123456</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-[#EF6A77] text-xl font-semibold">Upcoming News</p>
                        <img src="/assets/img/icon34.png" />
                        <div className="mt-2 bg-white rounded-2xl text-[#5E0D88] font-semibold shadowEffect w-32 text-center py-2">Get Access</div>
                    </div> */}
        {/* </div> */}
      </div>
    </>
  );
}
