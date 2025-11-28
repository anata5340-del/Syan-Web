import { Input, Modal } from "antd";
import Actions from "./actions";
import useContentModal from "./use-content-modal";

type ContentModalProps = {
  isOpen: boolean;
  handleToggleModal: () => void;
  data: any;
  dataIndex: number | null;
  handleUpdate: (index: number, key: string, value: string) => void;
};

const ContentModal = ({
  isOpen,
  data,
  dataIndex,
  handleUpdate,
  handleToggleModal,
}: ContentModalProps) => {
  const { handleSave, contentName, handleCancel, handleChangeContentName } =
    useContentModal({
      data,
      dataIndex,
      handleUpdate,
      handleToggleModal,
    });

  return (
    <>
      <Modal
        destroyOnClose
        closable={false}
        open={isOpen}
        footer={<Actions handleSave={handleSave} handleCancel={handleCancel} />}
      >
        <div className="flex flex-col justify-between items-center pb-10">
          <div className="bg-colordarkblue flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
            <div className="text-white text-xl">Update Content Name</div>
          </div>
          <div className="flex flex-col w-full px-10">
            <div className="flex items-center justify-between w-full mt-5">
              <div className="flex flex-col w-3/5">
                <label>Name:</label>
                <Input
                  value={contentName}
                  className="flex-none"
                  placeholder="Enter Name"
                  onChange={handleChangeContentName}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ContentModal;
