"use client";

import { Button, Modal, Select, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Collapse } from "antd";
import { useAddNotes } from "./use-add-notes";
import ContentModal from "./components/content-modal/content-modal";
import Actions from "./components/add-notes-modal/actions";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "3px",
};
const addBtnStyle1 = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};
const downloadBtnStyle = {
  background: "#FDC9CE",
  color: "#000",
};

type AddNotesProps = {
  refetchNotes: () => void;
};

export default function AddNotes({ refetchNotes }: AddNotesProps) {
  const {
    isContentModalOpen,
    handleToggleContentModal,
    categories,
    formData,
    isNotesModalOpen,
    handleSaveNotes,
    handleToggleNotesModal,
    handleFormData,
    handleAddContent,
    handleUpdateContent,
    handleDeleteContent,
    updateContentIndex,
    setUpdateContentIndex,
  } = useAddNotes({ refetchNotes });

  return (
    <>
      <Button
        type="primary"
        onClick={handleToggleNotesModal}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        footer={
          <Actions
            handleSave={handleSaveNotes}
            handleCancel={handleToggleNotesModal}
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
                  value={formData?.categories}
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Add Category"
                  options={categories}
                  onChange={(value) => handleFormData("categories", value)}
                />
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Notes Nahghhghme:</label>
              <Input
                value={formData?.name}
                placeholder="Enter Name"
                onChange={(e) => handleFormData("name", e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Title</label>
              <Input
                value={formData?.title}
                placeholder="Enter Name"
                onChange={(e) => handleFormData("title", e.target.value)}
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
                />
              </div>
              <div>
                <Button
                  className=""
                  type="primary"
                  onClick={handleAddContent}
                  style={addBtnStyle1}
                >
                  Add Content
                </Button>
              </div>
            </div>
            {formData?.content?.map((content, index) => (
              <div className="mt-5 flex items-center justify-start gap-3">
                <Collapse
                  className="w-full notesAccordion"
                  accordion
                  items={[
                    {
                      key: { index },
                      label: `${content?.name}`,
                      children: (
                        <div className="flex flex-col mt-4">
                          <TextArea
                            rows={7}
                            value={content?.content}
                            onChange={(e) =>
                              handleUpdateContent(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ),
                    },
                  ]}
                  expandIconPosition="end"
                />
                <img
                  src="/assets/img/icon12.png"
                  onClick={() => {
                    handleToggleContentModal();
                    setUpdateContentIndex(index);
                  }}
                />
                <img
                  src="/assets/img/icon14.png"
                  onClick={() => handleDeleteContent(index)}
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
