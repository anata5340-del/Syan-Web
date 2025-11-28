"use client";

import { Button, Modal, Select, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Collapse } from "antd";
import { useAddNotes } from "./use-add-notes";
import Actions from "@/frontend/components/upload/add-notes/components/add-notes-modal/actions";
import ContentModal from "@/frontend/components/upload/add-notes/components/content-modal/content-modal";
import { Dispatch, SetStateAction, useEffect } from "react";
import dynamic from "next/dynamic";

const RichTextEditorDynamic = dynamic(
  () => import("@/frontend/components/editor/RichTextEditor"),
  {
    ssr: false,
  }
);

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "5px",
};
const addBtnStyle1 = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

type AddNotesProps = {
  refetchNotes: () => void;
  onToggle?: () => void;
  isNotesModalOpen?: true | false;
  note?: any;
  mode?: string;
  setMode?: Dispatch<SetStateAction<string>>;
};

export default function AddNotes({
  refetchNotes,
  onToggle,
  isNotesModalOpen,
  note,
  mode,
  setMode,
}: AddNotesProps) {
  const {
    isContentModalOpen,
    handleToggleContentModal,
    categories,
    formData,
    setFormData,
    handleSaveNotes,
    handleUpdateNotes,
    handleFormData,
    handleAddContent,
    handleUpdateContent,
    handleDeleteContent,
    updateContentIndex,
    setUpdateContentIndex,
  } = useAddNotes({ refetchNotes });

  useEffect(() => {
    if (note && mode !== "New") {
      setFormData({
        name: note.name || "",
        title: note.title || "",
        author: note.author || "",
        categories: note.categories || [],
        content: note.content || [],
      });
    }
  }, [note, setFormData, mode]);

  const addNewNote = () => {
    onToggle();
    setMode("New");
    setFormData({
      name: "",
      title: "",
      author: "",
      categories: [],
      content: [],
    });
  };

  const handleViewSave = () => {
    onToggle();
  };
  const handleEditSave = () => {
    onToggle();
    handleUpdateNotes(note._id);
  };
  const handleSave = () => {
    handleSaveNotes();
    onToggle();
  };

  return (
    <>
      <Button
        type="primary"
        onClick={addNewNote}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        footer={
          <Actions
            handleSave={
              mode === "View"
                ? handleViewSave
                : mode === "Edit"
                ? handleEditSave
                : handleSave
            }
            handleCancel={onToggle}
          />
        }
        centered
        open={isNotesModalOpen}
        closable={false}
        width={800}
        className="addCourseModal"
      >
        <div className="flex flex-col justify-between items-center pb-10">
          <div className="bg-colordarkblue flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
            <div className="text-white text-xl">Add Notes</div>
          </div>
          <div className="flex flex-col w-full px-10">
            <div className="flex items-center justify-between w-full mt-5">
              <div className="flex flex-col w-3/5">
                <label>Category:</label>
                <Select
                  value={formData.categories.map((cat) => cat.name)} // Display category names in the select box
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Add Category"
                  options={categories
                    .filter(
                      (category) =>
                        !formData.categories.some(
                          (selectedCategory) =>
                            selectedCategory._id === category._id
                        )
                    )
                    .map((category) => ({
                      label: category.name, // Display category name in the dropdown
                      value: category.name, // Store category ID as the value (what's sent in the form data)
                    }))}
                  onChange={(selectedCategoryNames) => {
                    // Map selected category names to their corresponding full category objects
                    const selectedCategories = categories.filter(
                      (category) =>
                        selectedCategoryNames.includes(category.name) // Match the selected names
                    );
                    handleFormData("categories", selectedCategories); // Update formData with full category objects
                  }}
                  disabled={mode === "View"}
                />
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Notes Name:</label>
              <Input
                value={formData?.name}
                placeholder="Enter Name"
                onChange={(e) => handleFormData("name", e.target.value)}
                disabled={mode === "View"}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Title</label>
              <Input
                value={formData?.title}
                placeholder="Enter Name"
                onChange={(e) => handleFormData("title", e.target.value)}
                disabled={mode === "View"}
              />
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-5">
                <label className="font-medium">Author:</label>

                <Input
                  value={formData?.author}
                  className="flex-none"
                  placeholder="Enter Name"
                  onChange={(e) => handleFormData("author", e.target.value)}
                  disabled={mode === "View"}
                />
              </div>
              <div>
                <Button
                  className=""
                  type="primary"
                  onClick={handleAddContent}
                  style={addBtnStyle1}
                  disabled={mode === "View"}
                >
                  Add Content
                </Button>
              </div>
            </div>
            {formData?.content?.map((content, index) => (
              <div
                key={index}
                className="mt-5 flex items-center justify-start gap-3"
              >
                <Collapse
                  className="w-full notesAccordion"
                  accordion
                  items={[
                    {
                      key: index,
                      label: `${content?.name}`,
                      children: (
                        <div className="flex flex-col mt-4">
                          <RichTextEditorDynamic
                            value={content?.content || ""}
                            onChange={(value) =>
                              handleUpdateContent(index, "content", value)
                            }
                            readOnly={mode === "View"}
                            height={200}
                            placeholder="Start typing your content..."
                          />
                        </div>
                      ),
                    },
                  ]}
                  expandIconPosition="end"
                />
                <img
                  className={
                    mode === "View" ? "cursor-not-allowed" : "cursor-pointer"
                  }
                  src="/assets/img/icon12.png"
                  onClick={
                    mode === "View"
                      ? () => {}
                      : () => {
                          handleToggleContentModal();
                          setUpdateContentIndex(index);
                        }
                  }
                />
                <img
                  className={
                    mode === "View" ? "cursor-not-allowed" : "cursor-pointer"
                  }
                  src="/assets/img/icon14.png"
                  onClick={
                    mode === "View"
                      ? () => {}
                      : () => handleDeleteContent(index)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <ContentModal
        data={formData?.content}
        dataIndex={updateContentIndex}
        isOpen={isContentModalOpen}
        handleToggleModal={handleToggleContentModal}
        handleUpdate={handleUpdateContent}
      />
    </>
  );
}
