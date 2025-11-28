"use client";

import {
  Button,
  Modal,
  Select,
  Input,
  Form,
  Spin,
  Alert,
  Progress,
} from "antd";
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from "uuid";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import toast from "react-hot-toast";
import { File } from "buffer";
import { id } from "date-fns/locale";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "3px",
};

export default function AddVideos({
  refetch,
  isModalOpen,
  onToggle,
  mode,
  setMode,
  selectedVideo,
  setSelectedVideo,
}) {
  const [form] = Form.useForm();

  const handleAddNew = () => {
    onToggle();
    setMode("New");
  };
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState([{ id: uuidv4() }]);
  const [image, setImage] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [pdf, setPdf] = useState<File>();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [externalLink, setExternalLink] = useState<string>("");
  const [progress, setProgress] = useState({
    type: "thumbnail",
    percentage: 0,
  });

  const openLinkModal = () => setIsLinkModalOpen(true);
  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  const handleLinkSubmit = () => {
    if (!externalLink.trim()) {
      toast.error("Please enter a valid video link.");
      return;
    }
    // Update the video state with the external link
    setVideo(undefined); // Clear any uploaded video
    closeLinkModal();
    toast.success("External video link added successfully.");
  };
  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setExternalLink("");
    if (mode === "New") {
      form.resetFields();
      setVideo(undefined);
      setImage(undefined);
      setPdf(undefined);
      setContent([{ id: uuidv4() }]);
    } else if (mode === "Edit" || mode === "View") {
      if (selectedVideo) {
        // Prepare videoData for the form
        const videoData = {
          ...selectedVideo,
          categories: selectedVideo.categories?.map((cat) => cat.name), // Map categories to names
          content: selectedVideo.content?.map((item, index) => ({
            id: uuidv4(),
            [`content-title-${index}`]: item.name,
            [`content-from-h-${index}`]: item.startTime?.split(":")[0],
            [`content-from-m-${index}`]: item.startTime?.split(":")[1],
            [`content-from-s-${index}`]: item.startTime?.split(":")[2],
            [`content-to-h-${index}`]: item.endTime?.split(":")[0],
            [`content-to-m-${index}`]: item.endTime?.split(":")[1],
            [`content-to-s-${index}`]: item.endTime?.split(":")[2],
          })),
        };

        videoData.content.map((content, index) => {
          // Set the content title
          form.setFieldValue(
            `content-title-${content.id}`,
            content[`content-title-${index}`]
          );

          // Set the "From" time fields
          form.setFieldValue(
            `content-from-h-${content.id}`,
            content[`content-from-h-${index}`]
          );
          form.setFieldValue(
            `content-from-m-${content.id}`,
            content[`content-from-m-${index}`]
          );
          form.setFieldValue(
            `content-from-s-${content.id}`,
            content[`content-from-s-${index}`]
          );

          // Set the "To" time fields
          form.setFieldValue(
            `content-to-h-${content.id}`,
            content[`content-to-h-${index}`]
          );
          form.setFieldValue(
            `content-to-m-${content.id}`,
            content[`content-to-m-${index}`]
          );
          form.setFieldValue(
            `content-to-s-${content.id}`,
            content[`content-to-s-${index}`]
          );
        });

        // Set form values
        form.setFieldsValue(videoData);
        // Update content state with IDs for rendering the UI
        setContent(videoData.content);

        // Set video state
        // setVideo(selectedVideo.videoSource);
        // setImage(selectedVideo.thumbnail);
        // setPdf(selectedVideo.pdfSource);
      }
    }
  }, [selectedVideo, mode]);

  const getCategories = () => {
    axios
      .get("/api/categories")
      .then(({ data }) => {
        const categoriesList = data?.categories?.map(
          (category: { _id: string; name: string }) => ({
            ...category,
            value: category?._id,
            label: category?.name,
          })
        );
        setCategories(categoriesList);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNew = async () => {
    const formValues = form.getFieldsValue(); // Get all form values
    if (!image || !pdf || !(video || externalLink)) {
      toast.error("Missing required fields!");
      return;
    }
    try {
      setLoading(true);

      // Step 1: Generate Signed URLs for new files only
      const fileUploads = {};
      if (image) {
        const response = await axios.post("/api/videos/presigned-url", {
          fileName: image.name,
          fileType: image.type,
        });
        await axios.put(response.data.signedUrl, image, {
          headers: { "Content-Type": image.type },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress({ type: "thumbnail", percentage: percentage }); // Update the progress state
          },
        });
        fileUploads.thumbnail = response.data.url;
      }
      if (pdf) {
        const response = await axios.post("/api/videos/presigned-url", {
          fileName: pdf.name,
          fileType: pdf.type,
        });
        await axios.put(response.data.signedUrl, pdf, {
          headers: { "Content-Type": pdf.type },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress({ type: "pdf", percentage: percentage }); // Update the progress state
          },
        });
        fileUploads.pdfSource = response.data.url;
      }
      if (video) {
        const response = await axios.post("/api/videos/presigned-url", {
          fileName: video.name,
          fileType: video.type,
        });
        await axios.put(response.data.signedUrl, video, {
          headers: { "Content-Type": video.type },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress({ type: "video", percentage: percentage }); // Update the progress state
          },
        });
        fileUploads.videoSource = response.data.url;
      } else if (externalLink.trim() !== "") {
        fileUploads.videoSource = externalLink;
      }

      // Step 2: Prepare the updated video payload
      const videoData = {
        ...formValues,
        categories: formValues.categories.map((name) =>
          categories.find((cat) => cat.name === name)
        ),
        content: content.map((singleContent) => ({
          name: form.getFieldValue(`content-title-${singleContent.id}`),
          startTime: `${form
            .getFieldValue(`content-from-h-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-from-m-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-from-s-${singleContent.id}`)
            .padStart(2, "0")}`,
          endTime: `${form
            .getFieldValue(`content-to-h-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-to-m-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-to-s-${singleContent.id}`)
            .padStart(2, "0")}`,
        })),
        ...fileUploads,
      };

      await axios.post("/api/videos", { video: videoData });

      refetch();
      toast.success("Video Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to add video");
    } finally {
      onToggle();
      setLoading(false);
      setProgress({ type: "thumbnail", percentage: 0 }); // Reset progress state
    }
  };

  const handleUpdate = async () => {
    const formValues = form.getFieldsValue(); // Get all form values

    try {
      setLoading(true);

      // Step 1: Generate Signed URLs for new files only
      const fileUploads = {};
      if (image) {
        const response = await axios.post("/api/videos/presigned-url", {
          fileName: image.name,
          fileType: image.type,
        });
        await axios.put(response.data.signedUrl, image, {
          headers: { "Content-Type": image.type },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress({ type: "thumbnail", percentage: percentage }); // Update the progress state
          },
        });
        fileUploads.thumbnail = response.data.url;
      }
      if (pdf) {
        const response = await axios.post("/api/videos/presigned-url", {
          fileName: pdf.name,
          fileType: pdf.type,
        });
        await axios.put(response.data.signedUrl, pdf, {
          headers: { "Content-Type": pdf.type },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress({ type: "pdf", percentage: percentage }); // Update the progress state
          },
        });
        fileUploads.pdfSource = response.data.url;
      }
      if (video) {
        const response = await axios.post("/api/videos/presigned-url", {
          fileName: video.name,
          fileType: video.type,
        });
        await axios.put(response.data.signedUrl, video, {
          headers: { "Content-Type": video.type },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress({ type: "video", percentage: percentage }); // Update the progress state
          },
        });
        fileUploads.videoSource = response.data.url;
      } else {
        if (externalLink) {
          fileUploads.videoSource = externalLink;
        }
      }

      // Step 2: Prepare the updated video payload
      const videoData = {
        ...formValues,
        categories: formValues.categories.map((name) =>
          categories.find((cat) => cat.name === name)
        ),
        content: content.map((singleContent) => ({
          name: form.getFieldValue(`content-title-${singleContent.id}`),
          startTime: `${form
            .getFieldValue(`content-from-h-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-from-m-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-from-s-${singleContent.id}`)
            .padStart(2, "0")}`,
          endTime: `${form
            .getFieldValue(`content-to-h-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-to-m-${singleContent.id}`)
            .padStart(2, "0")}:${form
            .getFieldValue(`content-to-s-${singleContent.id}`)
            .padStart(2, "0")}`,
        })),
        ...fileUploads,
      };

      if (!image) videoData.thumbnail = selectedVideo.thumbnail;
      if (!pdf) videoData.pdfSource = selectedVideo.pdfSource;
      if (!video && !externalLink)
        videoData.videoSource = selectedVideo.videoSource;

      // Step 3: Send the updated video data to the API
      await axios.put("/api/videos", {
        id: selectedVideo._id,
        video: videoData,
      });

      refetch();
      toast.success("Video Updated Successfully");
    } catch (error) {
      console.error("Upload failed:", error.message, error.response?.data);
      toast.error(error.response?.data?.error || "Failed to update video");
    } finally {
      onToggle();
      setLoading(false);
      setProgress({ type: "thumbnail", percentage: 0 }); // Update the progress state
    }
  };

  const handleCancel = () => {
    onToggle();
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setState: Dispatch<SetStateAction<File | undefined>>
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setState(file);
    }
  };

  useEffect(() => getCategories(), []);

  return (
    <>
      <Button
        type="primary"
        onClick={handleAddNew}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        destroyOnClose
        footer={[
          <div
            key={"video-modal-footer"}
            className="flex gap-5 justify-center py-5 px-5"
          >
            <Button
              className="saveBtn"
              disabled={loading}
              key="submit"
              type="primary"
              onClick={
                mode === "View"
                  ? handleCancel
                  : mode === "Edit"
                  ? handleUpdate
                  : handleNew
              }
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
        centered
        open={isModalOpen}
        closable={false}
        width={800}
        className="addCourseModal"
      >
        <Form form={form}>
          <div className="flex flex-col justify-between items-center pb-4">
            <div className="bg-colordarkblue flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
              <div className="text-white text-xl">Add Video</div>
            </div>
            <div className="flex flex-col w-full px-10">
              <div className="flex items-center justify-between w-full mt-5">
                <div className="flex flex-col w-3/5">
                  <label>Category:</label>
                  <FormItem name="categories">
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Add Category"
                      options={
                        mode === "New"
                          ? categories
                              .filter((cat) => cat.name)
                              .map((cat) => ({
                                label: cat.name,
                                value: cat.name,
                              }))
                          : categories
                              .filter(
                                (category) =>
                                  !selectedVideo?.categories.some(
                                    (selectedCategory) =>
                                      selectedCategory._id === category._id
                                  )
                              )
                              .map((category) => ({
                                label: category.name, // Display category name in the dropdown
                                value: category.name, // Store category ID as the value (what's sent in the form data)
                              }))
                      }
                      onChange={(selectedCategoryNames) => {
                        // Map selected category names to their corresponding full category objects
                        const selectedCategories = categories.filter(
                          (category) =>
                            selectedCategoryNames.includes(category.name) // Match the selected names
                        );
                        form.setFieldValue(
                          "categories",
                          selectedCategories.map((cat) => cat.name)
                        );
                        mode !== "New" &&
                          setSelectedVideo((prev) => {
                            return { ...prev, categories: selectedCategories };
                          }); // Update formData with full category objects
                      }}
                      disabled={mode === "View"}
                    />
                  </FormItem>
                </div>
              </div>

              <div className="flex flex-pdfcol mt-4">
                <label className="font-medium mr-3">Video Name:</label>
                <FormItem name="name">
                  <Input placeholder="Enter Name" disabled={mode === "View"} />
                </FormItem>
              </div>

              <div className="flex flex-col mt-4">
                <label className="font-medium">Title:</label>
                <FormItem name="title">
                  <Input placeholder="Enter Name" disabled={mode === "View"} />
                </FormItem>
              </div>
              <div className="flex gap-10 mt-5">
                <div className="flex gap-3 items-center">
                  <label className="font-medium m-0">Author:</label>
                  <FormItem className="m-0" name="author">
                    <Input
                      className="flex-none"
                      placeholder="Enter Name"
                      disabled={mode === "View"}
                    />
                  </FormItem>
                </div>
              </div>
              <div className="flex gap-7 justify-between mt-4">
                <div
                  onClick={
                    mode === "View"
                      ? () => {}
                      : () => {
                          const fileInput =
                            document.getElementById("videoInput");
                          fileInput?.click();
                        }
                  }
                  className={`bg-[#F9D293] h-64 rounded-lg flex flex-col justify-center items-center w-4/6 ${
                    mode === "View" && "cursor-not-allowed"
                  }`}
                >
                  {mode !== "New" || video || externalLink ? (
                    <CheckCircleTwoTone
                      style={{ fontSize: "30px" }}
                      twoToneColor="#52c41a"
                    />
                  ) : (
                    <img src="/assets/img/icon19.png" />
                  )}
                  <p className="text-2xl font-medium">
                    {mode !== "New" || video || externalLink
                      ? "Video Selected"
                      : "Upload Video"}
                  </p>
                  <input
                    id="videoInput"
                    onChange={(event) => handleImageUpload(event, setVideo)}
                    type="file"
                    className="!hidden"
                  />
                </div>
                <div className="flex flex-col gap-8 w-2/6">
                  <div
                    onClick={
                      mode === "View"
                        ? () => {}
                        : () => {
                            const fileInput =
                              document.getElementById("imageInput");
                            fileInput?.click();
                          }
                    }
                    className={`bg-[#CEEAFF] h-28 rounded-lg flex flex-col justify-center items-center ${
                      mode === "View" && "cursor-not-allowed"
                    }`}
                  >
                    {mode !== "New" || image ? (
                      <CheckCircleTwoTone
                        style={{ fontSize: "30px" }}
                        twoToneColor="#52c41a"
                      />
                    ) : (
                      <img src="/assets/img/icon19.png" />
                    )}
                    <p className="text-lg font-medium">
                      {mode !== "New" || image
                        ? "Thumbnail Selected"
                        : "Upload Thumbnail"}
                    </p>
                    <input
                      id="imageInput"
                      onChange={(event) => handleImageUpload(event, setImage)}
                      type="file"
                      className="!hidden"
                    />
                  </div>
                  <div
                    onClick={
                      mode === "View"
                        ? () => {}
                        : () => {
                            const fileInput =
                              document.getElementById("pdfInput");
                            fileInput?.click();
                          }
                    }
                    className={`bg-[#FDC9CE] h-28 rounded-lg flex flex-col justify-center items-center ${
                      mode === "View" && "cursor-not-allowed"
                    }`}
                  >
                    {mode !== "New" || pdf ? (
                      <CheckCircleTwoTone
                        style={{ fontSize: "30px" }}
                        twoToneColor="#52c41a"
                      />
                    ) : (
                      <img src="/assets/img/icon19.png" />
                    )}
                    <p className="text-lg font-medium">
                      {mode !== "New" || pdf ? "PDF Selected" : "Upload PDF"}
                    </p>
                    <input
                      id="pdfInput"
                      onChange={(event) => handleImageUpload(event, setPdf)}
                      type="file"
                      className="!hidden"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                {/* Add this button in the form */}
                <Button
                  type="dashed"
                  disabled={mode === "View"}
                  onClick={openLinkModal}
                  style={{ marginBottom: 16 }}
                >
                  Insert External Video Link
                </Button>

                {/* Modal for external link input */}
                <Modal
                  title={
                    <div
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        backgroundColor: "#007BFF",
                        padding: "10px",
                        borderRadius: "4px 4px 0 0",
                      }}
                    >
                      Insert External Video Link
                    </div>
                  }
                  closable={false}
                  open={isLinkModalOpen}
                  onOk={handleLinkSubmit}
                  onCancel={() => {
                    closeLinkModal();
                    setExternalLink("");
                  }}
                  okText="Add Link"
                  cancelText="Cancel"
                  style={{
                    borderRadius: "8px", // Rounded corners for the modal
                    overflow: "hidden", // Ensure content stays inside
                  }}
                  styles={{
                    body: {
                      padding: "20px", // Padding for the modal body
                      backgroundColor: "#f9f9f9", // Light background for the body
                    },
                    footer: {
                      padding: "1rem  ", // Add margin to footer
                      paddingTop: "0",
                      marginTop: "0",
                    },
                  }}
                  okButtonProps={{
                    style: {
                      borderRadius: "4px",
                    },
                  }}
                  cancelButtonProps={{
                    style: {
                      borderRadius: "4px",
                    },
                  }}
                >
                  <Input
                    placeholder="Paste video link here (e.g., https://youtube.com/...)"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                  />
                </Modal>
              </div>
              <div className="flex flex-col mt-4">
                <div className="mb-2 flex justify-between">
                  <p>Content:</p>
                  <Button
                    onClick={
                      mode === "View"
                        ? () => {}
                        : () => {
                            setContent((prev) => [...prev, { id: uuidv4() }]);
                          }
                    }
                    disabled={mode === "View"}
                  >
                    +
                  </Button>
                </div>
                {content.map((content, index) => (
                  <div key={content.id} className="flex mb-2 gap-5">
                    <div className="flex gap-2 w-56">
                      <span className="mt-1">{index + 1}</span>
                      <FormItem
                        className="m-0"
                        name={`content-title-${content.id}`}
                      >
                        <Input
                          className="flex-none"
                          placeholder="Enter Title"
                          disabled={mode === "View"}
                        />
                      </FormItem>
                    </div>
                    <div className="flex gap-2 items-center videoContentUpload">
                      <p>From</p>
                      <FormItem
                        className="m-0"
                        name={`content-from-h-${content.id}`}
                      >
                        <Input
                          className="flex-none"
                          placeholder="hh"
                          disabled={mode === "View"}
                        />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-from-m-${content.id}`}
                      >
                        <Input
                          className="flex-none"
                          placeholder="min"
                          disabled={mode === "View"}
                        />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-from-s-${content.id}`}
                      >
                        <Input
                          className="flex-none"
                          placeholder="ss"
                          disabled={mode === "View"}
                        />
                      </FormItem>
                      <p>To</p>
                      <FormItem
                        className="m-0"
                        name={`content-to-h-${content.id}`}
                      >
                        <Input
                          className="flex-none"
                          placeholder="hh"
                          disabled={mode === "View"}
                        />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-to-m-${content.id}`}
                      >
                        <Input
                          className="flex-none"
                          placeholder="min"
                          disabled={mode === "View"}
                        />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-to-s-${content.id}`}
                      >
                        <Input
                          className="flex-none"
                          placeholder="ss"
                          disabled={mode === "View"}
                        />
                      </FormItem>
                    </div>
                    <div
                      onClick={
                        mode === "View"
                          ? () => {}
                          : () => {
                              setContent((prev) =>
                                prev.filter(
                                  (prevContent) => prevContent.id !== content.id
                                )
                              );
                            }
                      }
                      className="flex gap-2 items-center cursor-pointer"
                    >
                      <img
                        src="/assets/img/icon27.png"
                        className={`${
                          mode === "View" && " cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col mt-4">
                <label className="font-medium">Add Description:</label>

                <FormItem name="description">
                  <TextArea
                    className="transparentInput"
                    rows={7}
                    disabled={mode === "View"}
                  />
                </FormItem>
              </div>
            </div>
            {loading && (
              <>
                <Progress
                  percent={progress.percentage}
                  status={progress.percentage === 100 ? "success" : "active"}
                  className="w-2/3"
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
                {progress.percentage < 100 ? (
                  <Alert
                    message="Uploading..."
                    description={`Your ${progress.type} is currently being uploaded (${progress.percentage}%). Please wait.`}
                    type="info"
                    showIcon
                    className="mt-4"
                  />
                ) : (
                  <Alert
                    message="Processing..."
                    description="Your video is being processed after upload. Please wait."
                    type="info"
                    showIcon
                    className="mt-4"
                  />
                )}
              </>
            )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
