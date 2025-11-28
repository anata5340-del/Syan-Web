"use client";

import { Button, Modal, Select, Input, Form } from "antd";
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

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
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

const { Option } = Select;
const children = [""];

export default function AddVideos({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState([{ id: uuidv4() }]);
  const [image, setImage] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [pdf, setPdf] = useState<File>();
  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const handleOk = async () => {
    const formData = new FormData();
    const formEntries = Object.entries(form.getFieldsValue());
    formEntries.forEach(([key, value]) => {
      if (key === "categories") {
        value.map((category, index) => {
          return formData.append(`video[${key}][${index}]`, category);
        });
      } else {
        formData.append(`video[${key}]`, `${value}`);
      }
    });

    const formContent = content.map((singleContent) => {
      const name = form.getFieldValue(`content-title-${singleContent.id}`);
      const fromH = form.getFieldValue(`content-from-h-${singleContent.id}`);
      const fromM = form.getFieldValue(`content-from-m-${singleContent.id}`);
      const fromS = form.getFieldValue(`content-from-s-${singleContent.id}`);
      const toH = form.getFieldValue(`content-to-h-${singleContent.id}`);
      const toM = form.getFieldValue(`content-to-m-${singleContent.id}`);
      const toS = form.getFieldValue(`content-to-s-${singleContent.id}`);

      return {
        name,
        startTime: `${fromH?.padStart(2, "0")}:${fromM?.padStart(
          2,
          "0"
        )}:${fromS?.padStart(2, "0")}`,
        endTime: `${toH?.padStart(2, "0")}:${toM?.padStart(
          2,
          "0"
        )}:${toS?.padStart(2, "0")}`,
      };
    });

    formContent.forEach((item, index) => {
      formData.append(`video[content][${index}][name]`, `${item.name}`);
      formData.append(
        `video[content][${index}][startTime]`,
        `${item.startTime}`
      );
      formData.append(`video[content][${index}][endTime]`, `${item.endTime}`);
    });

    if (image) formData.append("image", image);
    if (video) formData.append("videoSource", video);
    if (pdf) formData.append("pdfSource", pdf);

    try {
      await axios.post("/api/videos", formData);
      refetch();
      toast.success("Video Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Video Addition Failed");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [options, setOptions] = useState([{ id: 1, label: "Option A" }]);

  const handleAddBulk = () => {
    const newId = options.length + 1;
    const newLabel = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: newId, label: `Option ${newLabel}` }]);
  };

  const handleDeleteOption = (id: number) => {
    setOptions(options.filter((option) => option.id !== id));
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
        onClick={showModal}
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
              key="submit"
              type="primary"
              onClick={handleOk}
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
          <div className="flex flex-col justify-between items-center pb-10">
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
                      options={categories}
                    />
                  </FormItem>
                </div>
              </div>

              <div className="flex flex-pdfcol mt-4">
                <label className="font-medium">Video Name:</label>
                <FormItem name="name">
                  <Input placeholder="Enter Name" />
                </FormItem>
              </div>

              <div className="flex flex-col mt-4">
                <label className="font-medium">Title:</label>
                <FormItem name="title">
                  <Input placeholder="Enter Name" />
                </FormItem>
              </div>
              <div className="flex gap-10 mt-5">
                <div className="flex gap-3 items-center">
                  <label className="font-medium m-0">Author:</label>
                  <FormItem className="m-0" name="author">
                    <Input className="flex-none" placeholder="Enter Name" />
                  </FormItem>
                </div>
              </div>
              <div className="flex gap-7 justify-between mt-4">
                <div
                  onClick={() => {
                    const fileInput = document.getElementById("videoInput");
                    fileInput?.click();
                  }}
                  className="bg-[#F9D293] h-64 rounded-lg flex flex-col justify-center items-center w-4/6"
                >
                  {video ? (
                    <CheckCircleTwoTone
                      style={{ fontSize: "30px" }}
                      twoToneColor="#52c41a"
                    />
                  ) : (
                    <img src="/assets/img/icon19.png" />
                  )}
                  <p className="text-2xl font-medium">
                    {video ? "Video Selected" : "Upload Video"}
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
                    onClick={() => {
                      const fileInput = document.getElementById("imageInput");
                      fileInput?.click();
                    }}
                    className="bg-[#CEEAFF] h-28 rounded-lg flex flex-col justify-center items-center"
                  >
                    {image ? (
                      <CheckCircleTwoTone
                        style={{ fontSize: "30px" }}
                        twoToneColor="#52c41a"
                      />
                    ) : (
                      <img src="/assets/img/icon19.png" />
                    )}
                    <p className="text-lg font-medium">
                      {image ? "Thumbnail Selected" : "Upload Thumbnail"}
                    </p>
                    <input
                      id="imageInput"
                      onChange={(event) => handleImageUpload(event, setImage)}
                      type="file"
                      className="!hidden"
                    />
                  </div>
                  <div
                    onClick={() => {
                      const fileInput = document.getElementById("pdfInput");
                      fileInput?.click();
                    }}
                    className="bg-[#FDC9CE] h-28 rounded-lg flex flex-col justify-center items-center"
                  >
                    {pdf ? (
                      <CheckCircleTwoTone
                        style={{ fontSize: "30px" }}
                        twoToneColor="#52c41a"
                      />
                    ) : (
                      <img src="/assets/img/icon19.png" />
                    )}
                    <p className="text-lg font-medium">
                      {pdf ? "PDF Selected" : "Upload PDF"}
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
                <div className="mb-2 flex justify-between">
                  <p>Content:</p>
                  <Button
                    onClick={() => {
                      setContent((prev) => [...prev, { id: uuidv4() }]);
                    }}
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
                        />
                      </FormItem>
                    </div>
                    <div className="flex gap-2 items-center videoContentUpload">
                      <p>From</p>
                      <FormItem
                        className="m-0"
                        name={`content-from-h-${content.id}`}
                      >
                        <Input className="flex-none" placeholder="hh" />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-from-m-${content.id}`}
                      >
                        <Input className="flex-none" placeholder="min" />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-from-s-${content.id}`}
                      >
                        <Input className="flex-none" placeholder="ss" />
                      </FormItem>
                      <p>To</p>
                      <FormItem
                        className="m-0"
                        name={`content-to-h-${content.id}`}
                      >
                        <Input className="flex-none" placeholder="hh" />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-to-m-${content.id}`}
                      >
                        <Input className="flex-none" placeholder="min" />
                      </FormItem>
                      <span>:</span>
                      <FormItem
                        className="m-0"
                        name={`content-to-s-${content.id}`}
                      >
                        <Input className="flex-none" placeholder="ss" />
                      </FormItem>
                    </div>
                    <div
                      onClick={() => {
                        setContent((prev) =>
                          prev.filter(
                            (prevContent) => prevContent.id !== content.id
                          )
                        );
                      }}
                      className="flex gap-2 items-center cursor-pointer"
                    >
                      <img src="/assets/img/icon27.png" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col mt-4">
                <label className="font-medium">Add Description:</label>
                <FormItem name="description">
                  <TextArea className="transparentInput" rows={7} />
                </FormItem>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
}
