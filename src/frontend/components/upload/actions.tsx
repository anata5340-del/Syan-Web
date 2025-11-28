import { Button } from "antd";

type ActionProps = {
  handleSave: () => void;
  handleCancel: () => void;
};

const Actions = ({ handleSave, handleCancel }: ActionProps) => {
  return [
    <div className="flex gap-5 justify-center py-5 px-5">
      <Button
        className="saveBtn"
        key="submit"
        type="primary"
        onClick={handleSave}
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
  ];
};

export default Actions;
