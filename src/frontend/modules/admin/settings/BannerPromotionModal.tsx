import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Input, Button, Upload } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const BannerPromotionModal = ({ isModalVisible, setIsModalVisible }) => {
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [settingsId, setSettingsId] = useState(null);

  // Fetch settings when the modal renders
  useEffect(() => {
    if (isModalVisible) {
      setFileList([]);
      setLink("");
      fetchSettings();
    }
  }, [isModalVisible]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      const { data } = response;
      if (data) {
        setSettingsId(data._id || null);
        setLink(data.promotionLink || "");
        setImage(data.image || "");
        setImageName(data.imageName || "");
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error.message);
    }
  };

  // Handle image update with both image and promotion link
  const handleImageUpdate = async () => {
    if (!fileList.length) {
      toast.error("No image selected!");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileList[0] ? fileList[0] : image);
    formData.append("imageName", fileList[0] ? fileList[0].name : imageName); // Include image name

    try {
      await axios.post("/api/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Image updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to update image:", error.message);
    }
  };

  // Handle link update only
  const handleLinkUpdate = async () => {
    const formData = new FormData();
    formData.append("promotionLink", link); // Include the current link
    try {
      await axios.post("/api/settings", formData);
      toast.success("Link updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  // Handle file upload logic
  const handleUpload = (file) => {
    setFileList([file]); // Allow only one file
    return false; // Prevent default upload behavior
  };

  // Remove uploaded file
  const handleRemove = () => {
    setFileList([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title={
        <div className="bg-[#f9f9f9] text-black text-xl p-5 pb-0 rounded">
          Banner Promotion
        </div>
      }
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      styles={{
        body: {
          padding: "20px", // Padding for the modal body
          paddingTop: "0px",
          backgroundColor: "#f9f9f9", // Light background for the body
          borderRadius: "0.25rem",
        },
        header: {
          margin: "0",
        },
        footer: {
          padding: "1rem", // Add margin to footer
          paddingTop: "0",
          marginTop: "0",
        },
      }}
    >
      <p className="mb-4">
        Please upload a vertical banner image of <strong>369W x 896H</strong>
      </p>

      {/* Upload Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Upload Button */}
        <Upload
          beforeUpload={handleUpload}
          fileList={fileList}
          onRemove={handleRemove}
          accept="image/*"
          showUploadList={false}
        >
          <Button
            icon={<UploadOutlined />}
            style={{
              border: "2px dashed #d9d9d9",
              width: "100px", // Maintain aspect ratio
              height: "242px", // Calculated: (896 / 369) * 100
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Upload
          </Button>
        </Upload>

        {/* Image Preview */}
        {(fileList.length > 0 || settingsId) && (
          <>
            <div
              style={{
                width: "100px", // Match button width
                height: "242px", // Match button height
                position: "relative",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <img
                src={
                  fileList.length > 0 ? URL.createObjectURL(fileList[0]) : image
                }
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {fileList.length > 0 && (
                <CloseOutlined
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    color: "#ff4d4f",
                    cursor: "pointer",
                  }}
                  className="rounded backdrop-blur-[0.5px] bg-white/30"
                  onClick={handleRemove}
                />
              )}
            </div>
            <div>{fileList.length > 0 ? fileList[0].name : imageName}</div>

            <button
              className="bg-[#268A9B] rounded-3xl px-5 ml-auto text-[#fff] py-2"
              type="button"
              onClick={handleImageUpdate}
            >
              Update Image
            </button>
          </>
        )}
      </div>

      {/* Input for Button Link */}
      <div className="mb-4">
        <label className="block mb-1 font-bold">Buttons Link</label>
        <div className="flex justify-between">
          <Input
            placeholder="Paste a link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={{ display: "inline", width: "70%" }}
          />
          <button
            className="bg-[#268A9B] rounded-3xl px-5 text-[#fff] py-2"
            type="button"
            onClick={handleLinkUpdate}
          >
            Update Link
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BannerPromotionModal;
