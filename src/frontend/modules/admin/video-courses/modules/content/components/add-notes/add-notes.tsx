"use client";

import { Button, Modal, Select, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useAddNotes } from "./use-add-notes";
import AddNotesTable from "./add-notes-table";
import { useEffect, useState } from "react";
import { useCategories } from "@/frontend/modules/admin/library/useCategories";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "3.55px",
};

const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

type AddNotesType = {
  selectedNote: null | { _id: string };
  refetch: () => void;
  parentIds: {
    videoCourseId: string;
    moduleId: string;
    sectionId: string;
    subSectionId: string;
    subSectionBlockId: string;
  };
};
export default function AddNotes({
  selectedNote,
  refetch,
  parentIds,
}: AddNotesType) {
  const {
    notes,
    handleNoteSelect,
    isModalOpen,
    toggleModal,
    handleCancel,
    handleOk,
  } = useAddNotes({ selectedNote, refetch, parentIds });

  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { categories } = useCategories();

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const filtered = notes.filter((note) => {
      const categoriesMap = note.categories?.map((category) => category.name);
      const matchesQuery = note.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || categoriesMap?.includes(filterCategory);

      return matchesQuery && matchesCategory;
    });
    setFilteredNotes(filtered);
  }, [searchQuery, notes, filterCategory]);

  return (
    <>
      <Button
        type="primary"
        onClick={toggleModal}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        footer={[
          <div
            key="footer-content"
            className="flex gap-5 justify-end py-5 px-5"
          >
            <Button
              className="saveBtn"
              key="submit"
              type="primary"
              onClick={handleOk}
            >
              Save
            </Button>
            <Button
              className="cancelBtn"
              key="cancel"
              type="primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>,
        ]}
        style={{ left: 250, paddingBottom: 0 }}
        open={isModalOpen}
        centered
        closable={false}
        width={900}
        className="addCourseModal !left-0"
      >
        <div className="flex flex-col gap-5 justify-between items-center pb-10">
          <div className="bg-colorred flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
            <div className="text-white text-xl">Notes</div>
          </div>
          <div className="flex gap-10 justify-between">
            <div className="flex">
              <p className="text-black text-2xl">List of all Notes</p>
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
                optionFilterProp="children"
                filterOption={filterOption}
                onChange={(value) => setFilterCategory(value)}
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
          </div>
          <div className="w-full">
            <AddNotesTable
              dataSource={filteredNotes}
              onSelect={handleNoteSelect}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
