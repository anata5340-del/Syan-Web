import { Button, Modal } from "antd";
import Input from "antd/es/input/Input";
import { InputNumber } from "antd";

export const PaymentOption = ({ handleSave, handleCancel, isModalOpen }) => {
  return (
    <Modal
      footer={[
        <div className="flex gap-5 justify-start py-5 px-10">
          <Button
            className="bg-[#EF6A77]"
            key="submit"
            type="primary"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button
            className="bg-[transparent] text-[#3E3E3E] border border-[#3E3E3E] w-28"
            key="cancel"
            type="primary"
            onClick={handleCancel}
          >
            Close
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
      width={650}
      className="nameModal"
    >
      <div className="flex flex-col gap-6 px-10 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[#231F20] text-2xl font-semibold">
            Add New Payment Method
          </h2>
          <img
            className="w-7 mt-0.5 cursor-pointer"
            src="/assets/img/icon55.png"
            alt="close"
            onClick={handleCancel}
          />
        </div>
        <div>
          <label className="text-[#5E5E5E] text-xs font-semibold">
            Credit or DebitCard Option
          </label>
          <Input />
        </div>
        <div className="flex gap-5">
          <div>
            <label className="text-[#5E5E5E] text-xs font-semibold">
              Month
            </label>
            <Input />
          </div>
          <div>
            <label className="text-[#5E5E5E] text-xs font-semibold">Year</label>
            <Input />
          </div>
          <div>
            <label className="text-[#5E5E5E] text-xs font-semibold">
              CVV Code
            </label>
            <Input />
          </div>
        </div>
        <div>
          <label className="text-[#5E5E5E] text-xs font-semibold">
            Card Holder Name
          </label>
          <Input />
        </div>
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
