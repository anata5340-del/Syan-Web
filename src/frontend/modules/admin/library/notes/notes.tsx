import ContentTable from "@/frontend/components/table/contentTable";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import AddNotes from "./addNotes";
import { useNotes } from "./use-notes";
import { useEffect, useState } from "react";
import { useCategories } from "../useCategories";
import { useAddNotes } from "@/frontend/components/upload/add-notes/use-add-notes";
import AddCategories from "../AddCategories";

const addBtnStyle = {
  color: "#4F4F4F",
  background: "#FAB683",
  padding: "15px 20px",
  borderRadius: "5px",
};

export default function Notes() {
  const { notes, handleDeleteNote, refetchNotes } = useNotes();
  const { categories, refetchCategories } = useCategories();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [selectedNote, setSelectedNote] = useState(null); // State for the clicked note
  const [mode, setMode] = useState(""); // State for the clicked note

  const { handleToggleNotesModal, isNotesModalOpen } = useAddNotes({
    refetchNotes,
  });

  const handleNotesEdit = (note) => {
    setSelectedNote(note); // Store the note data for editing
    setMode("Edit");
    handleToggleNotesModal();
  };

  const handleNotesView = (note) => {
    setSelectedNote(note); // Store the note data for viewing
    setMode("View");
    handleToggleNotesModal();
  };

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
      <AddCategories
        isModalOpen={showModal}
        categories={categories}
        toggleModal={() => {
          setShowModal((prev) => !prev);
        }}
        refetch={refetchCategories}
      />
      <div className="flex justify-between mt-2 mb-5">
        <div className="flex">
          <p className="text-black text-2xl">List of all notes</p>
        </div>
        <div className="flex gap-20">
          <Input
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
            }}
            className="userSearch"
            style={{ width: 250 }}
            prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
            suffix={"Search"}
          />
          <div>
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
            <Button
              type="primary"
              onClick={() => {
                setShowModal(true);
              }}
              style={addBtnStyle}
              icon={<PlusOutlined />}
            ></Button>
          </div>
        </div>
        <div>
          <AddNotes
            refetchNotes={refetchNotes}
            onToggle={handleToggleNotesModal}
            isNotesModalOpen={isNotesModalOpen}
            note={selectedNote} // Pass the selected note to the AddNotes component
            mode={mode}
            setMode={setMode}
          />
        </div>
      </div>
      <div>
        <ContentTable
          dataSource={filteredNotes}
          onDelete={handleDeleteNote}
          onEdit={handleNotesEdit} // Pass the handleNotesEdit callback
          onView={handleNotesView} // Pass the handleNotesView callback
        />
      </div>
    </>
  );
}
