"use client";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ContentTable from "@/frontend/components/table/contentTable";
import AddQuiz from "@/frontend/components/upload/addQuiz";

export default function Content() {
  const addBtnStyle = {
    background: "#01B067",
    padding: "16px 35px",
    borderRadius: "unset",
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <div className="flex flex-col text-white mt-10">
        <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
          <div className="flex gap-5 bg-white w-4/12 py-1 justify-center items-center rounded-lg">
            <img src="/assets/img/icon3.png" />
            <p className="text-base text-black">Quiz List</p>
          </div>
        </div>
        <div className="border border-x-black py-5 px-2">
          <div className="flex justify-between">
            <div className="flex">
              <p className="text-black text-2xl">List of all quiz</p>
            </div>
            <div className="flex gap-20">
              <Input
                className="userSearch"
                style={{ width: 250 }}
                prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                suffix={"Search"}
              />
              <Select
                className="quizCategory"
                showSearch
                placeholder="Category"
                optionFilterProp="children"
                filterOption={filterOption}
                options={[
                  {
                    value: "gross anatomy",
                    label: "gross anatomy",
                  },
                  {
                    value: "gross anatomy",
                    label: "gross anatomy",
                  },
                  {
                    value: "gross anatomy",
                    label: "gross anatomy",
                  },
                ]}
              />
            </div>
            <div>
              <AddQuiz />
            </div>
          </div>
        </div>
        <div>
          <ContentTable />
        </div>
      </div>
    </>
  );
}
