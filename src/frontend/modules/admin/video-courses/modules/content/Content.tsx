"use client";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ContentTable from "@/frontend/components/table/contentTable";
import AddQuiz from "@/frontend/components/upload/addQuiz";
import { useBlockContent } from "./useBlockContent";
import AddNotes from "./components/add-notes/add-notes";
import AddVideos from "./components/add-videos/add-videos";
import AddQuestions from "./components/add-questions/add-questions";

import { useDeleteNote } from "./useDeleteNote";
import { useDeleteVideo } from "./useDeleteVideo";
import { useDeleteQuestion } from "./useDeleteQuestion";
import { useEffect, useState } from "react";

import { useCategories } from "../../../library/useCategories";

export default function Content() {
  const { refetch, subSectionBlockData, parentIds } = useBlockContent();
  const { handleDeleteNote } = useDeleteNote({ refetch, parentIds });
  const { handleDeleteVideo } = useDeleteVideo({ refetch, parentIds });
  const { handleDeleteQuestion } = useDeleteQuestion({ refetch, parentIds });

  const [filteredQuestions, setFilteredQuestions] = useState(
    subSectionBlockData?.questions
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { categories } = useCategories();

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const filtered = subSectionBlockData?.questions.filter((question) => {
      const categoriesMap = question?.categories?.map(
        (category) => category.name
      );
      const matchesQuery = question?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || categoriesMap?.includes(filterCategory);

      return matchesQuery && matchesCategory;
    });
    setFilteredQuestions(filtered);
  }, [searchQuery, subSectionBlockData?.questions, filterCategory]);

  return (
    <div className="flex flex-col my-8 gap-10">
      <div className="flex flex-col text-white gap-5">
        <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
          <p className="text-2xl">Notes</p>
        </div>
        <div className="flex justify-end ">
          {/* <AddQuiz /> */}
          <AddNotes
            selectedNote={subSectionBlockData?.note}
            refetch={refetch}
            parentIds={parentIds}
          />
        </div>
        <div>
          <ContentTable
            onDelete={handleDeleteNote}
            dataSource={
              subSectionBlockData?.note ? [subSectionBlockData?.note] : []
            }
            showEditAndView={false}
          />
        </div>
      </div>

      <div className="flex flex-col text-white gap-5">
        <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
          <p className="text-2xl">Videos</p>
        </div>
        <div className="flex justify-end">
          {/* <AddQuiz /> */}
          <AddVideos
            selectedVideo={subSectionBlockData?.video}
            refetch={refetch}
            parentIds={parentIds}
          />
        </div>
        <div>
          <ContentTable
            onDelete={handleDeleteVideo}
            dataSource={
              subSectionBlockData?.video ? [subSectionBlockData?.video] : []
            }
            showEditAndView={false}
          />
        </div>
      </div>

      <div className="flex flex-col text-white">
        <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
          <p className="text-2xl">Quiz</p>
        </div>
        <div className="border border-x-black py-5 px-2">
          <div className="flex justify-between">
            <div className="flex">
              <p className="text-black text-2xl">List of all quiz</p>
            </div>
            <div className="flex gap-20">
              <Input
                className="userSearch"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                }}
                style={{ width: 250 }}
                prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                suffix={"Search"}
              />
              <Select
                className="quizCategory"
                showSearch
                placeholder="Category"
                onChange={(value) => setFilterCategory(value)}
                optionFilterProp="children"
                filterOption={filterOption}
                options={[
                  {
                    label: "All",
                    value: "All",
                  },
                  ...categories.map((category) => ({
                    label: category.name,
                    value: category.name,
                  })),
                ]}
              />
            </div>
            <div>
              {/* <AddQuiz /> */}
              <AddQuestions
                selectedQuestions={subSectionBlockData?.questions}
                refetch={refetch}
                parentIds={parentIds}
              />
            </div>
          </div>
        </div>
        <div>
          <ContentTable
            onDelete={handleDeleteQuestion}
            dataSource={filteredQuestions ?? []}
            showEditAndView={false}
          />
        </div>
      </div>
    </div>
  );
}
