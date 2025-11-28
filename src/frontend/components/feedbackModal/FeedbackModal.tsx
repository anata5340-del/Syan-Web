import React, { useState } from "react";
import { Modal, Input } from "antd";
import toast from "react-hot-toast";
import axios from "axios";

const FeedbackModal = ({
  isModalVisible,
  setIsModalVisible,
  type, // "quiz", "note", or "video"
  userId, // ID of the user sending feedback
  id, // ID of the specific quiz, note, or video
}) => {
  const [feedback, setFeedback] = useState("");

  const handleCancel = () => {
    setFeedback("");
    setIsModalVisible(false);
  };

  const sendFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback is empty. Please enter your feedback.");
      return;
    }

    // Create the feedback message
    try {
      const { data } = await axios.post("/api/users/feedback", {
        id,
        userId,
        type,
        message: feedback,
      });
      console.log(data);
      toast.success(data.message);
      // Reset and close the modal
      setFeedback("");
      setIsModalVisible(false);
    } catch (error: any) {
      toast.error(`Failed to send feedback: ${error?.response?.data?.error}`);
    }
  };

  return (
    <Modal
      title={
        <div className="bg-[#fa9aa4] pb-1 rounded-t-md">
          <div className="flex pt-2 mx-5">
            <h2 className="text-xl">Submit Feedback</h2>
          </div>
          <p className="font-normal mx-5">
            Provide feedback for the selected {type}.
          </p>
        </div>
      }
      footer={[
        <div className="p-2 pt-0 flex justify-center" key="footer">
          <button
            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 ml-2 bg-[#fa9aa4] text-white rounded-md hover:bg-[#fc7d8a] transition duration-200"
            onClick={sendFeedback}
          >
            Submit
          </button>
        </div>,
      ]}
      open={isModalVisible}
      onCancel={handleCancel}
      styles={{
        body: {
          padding: "20px", // Padding for the modal body
        },
      }}
      width={800}
    >
      <Input.TextArea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={6}
        placeholder={`Enter your feedback for this ${type}...`}
      />
    </Modal>
  );
};

export default FeedbackModal;
