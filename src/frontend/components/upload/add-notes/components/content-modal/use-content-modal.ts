import { useEffect, useState } from "react";

type UseContentModalProps = {
  data: any;
  dataIndex: number;
  handleToggleModal: () => void;
  handleUpdate: (index: number, key: string, value: string) => void;
};

const useContentModal = ({
  data,
  dataIndex,
  handleUpdate,
  handleToggleModal,
}: UseContentModalProps) => {
  const [contentName, setContentName] = useState("");

  useEffect(() => {
    if (data[dataIndex]?.name) {
      setContentName(data[dataIndex]?.name);
    }
  }, [data, dataIndex]);

  const handleSave = () => {
    handleUpdate(dataIndex, "name", contentName);
    handleToggleModal();
    setContentName("");
  };

  const handleCancel = () => {
    setContentName("");
    handleToggleModal();
  };

  const handleChangeContentName = (e) => {
    setContentName(e.target.value);
  };

  return {
    handleSave,
    contentName,
    handleCancel,
    handleChangeContentName,
  };
};

export default useContentModal;
