import { Button, Modal } from "antd";
import Input from "antd/es/input/Input";
import { InputNumber } from "antd";

export const PackageNameModal = ({
  mode,
  handleSave,
  handleCancel,
  isModalOpen,
  packageName,
  setPackageName,
}) => {
  return (
    <Modal
      footer={[
        <div className="flex gap-5 justify-end py-5 px-10 bg-[#EDF7FF]">
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
      ]}
      style={{
        top: 80,
        right: 300,
        backgroundColor: "#EDF7FF",
        paddingBottom: 0,
      }}
      open={isModalOpen}
      closable={false}
      width={350}
      className="nameModal"
    >
      <div className="px-10 pt-4 bg-[#EDF7FF]">
        <label>Name:</label>
        <Input
          value={packageName}
          placeholder="Enter Name"
          onChange={(e) => setPackageName(e.target.value)}
        />
      </div>
      {/* <div className="flex flex-col px-10 pt-4 bg-[#EDF7FF]">
        <label>Price:</label>
        <InputNumber
          style={{ width: "100%" }}
          value={packagePrice}
          placeholder="Enter Price"
          onChange={(price) => setPackagePrice(price)}
        />
      </div> */}
    </Modal>
  );
};
