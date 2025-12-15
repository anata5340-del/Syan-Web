"use client";
import React from "react";
import { Modal } from "antd";

interface LabValue {
  name: string;
  range: string;
}

interface LabValuesModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const labValues: Record<string, LabValue[]> = {
  Blood: [
    { name: "Hemoglobin (Male)", range: "13.5-17.5 g/dL" },
    { name: "Hemoglobin (Female)", range: "12.0-15.5 g/dL" },
    { name: "WBC", range: "4,500-11,000 /µL" },
    { name: "Platelets", range: "150k-450k /µL" },
  ],
  Electrolytes: [
    { name: "Sodium (Na)", range: "135-145 mEq/L" },
    { name: "Potassium (K)", range: "3.5-5.0 mEq/L" },
    { name: "Chloride (Cl)", range: "96-106 mEq/L" },
    { name: "Bicarb (HCO3)", range: "22-29 mEq/L" },
    { name: "Calcium", range: "8.5-10.2 mg/dL" },
  ],
  Kidney: [
    { name: "BUN", range: "7-20 mg/dL" },
    { name: "Creatinine", range: "0.6-1.2 mg/dL" },
  ],
};

const LabValuesModal = ({
  isModalVisible,
  setIsModalVisible,
}: LabValuesModalProps) => {
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title={
        <div className="bg-[#277C72] pb-1 rounded-t-md">
          <div className="flex items-center justify-between pt-2 mx-5">
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h2 className="text-xl text-white">Normal Lab Values</h2>
            </div>
          </div>
        </div>
      }
      footer={null}
      open={isModalVisible}
      onCancel={handleCancel}
      styles={{
        body: {
          padding: "20px",
        },
      }}
      width={700}
    >
      <div className="space-y-6">
        {Object.entries(labValues).map(([category, values]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-[#277C72] mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {values.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 border-b border-gray-200 hover:bg-gray-50"
                >
                  <span className="text-gray-700 font-medium">
                    {item.name}
                  </span>
                  <span className="text-gray-600 font-semibold">
                    {item.range}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default LabValuesModal;

