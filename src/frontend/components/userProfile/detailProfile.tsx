import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, message, Upload } from "antd";
import type { FormInstance, GetProp, UploadProps } from "antd";
import UploadPics from "./uploadPics";
import FormItem from "antd/es/form/FormItem";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type Props = {
  form: FormInstance;
  onSave: () => Promise<void>;
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function DetailProfile({ form, onSave }: Props) {
  const baseUrl = process.env.BASE_URL;

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>();

  useEffect(() => {
    setImageUrl(
      form.getFieldValue("image") ? `${form.getFieldValue("image")}` : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Form form={form}>
      <div className="px-10 pt-6 py-5">
        <div className="flex">
          <div className="w-11/12">
            <div className="flex flex-grow my-7">
              <label className="w-80">First Name</label>
              <FormItem name="firstName" className="w-8/12  m-0">
                <Input className="userInput" />
              </FormItem>
            </div>
            <div className="flex flex-grow my-7">
              <label className="w-80">Last Name</label>
              <FormItem name="lastName" className="w-8/12  m-0">
                <Input className="userInput" />
              </FormItem>
            </div>
          </div>
          <div className="flex w-1/12">
            <FormItem name="_id">
              <Input className="userInput !hidden" />
            </FormItem>
            <FormItem name="image">
              <Upload
                listType="picture-circle"
                className="avatar-uploader upload-btn"
                showUploadList={false}
                action=""
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{ width: "100%" }}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </FormItem>
          </div>
        </div>

        <div className="flex items-center flex-grow mb-7">
          <label className="w-80">Whatsapp Number</label>
          <FormItem name="phone" className="w-8/12 m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">CNIC/Passport No</label>
          <FormItem name="cnic" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">Email</label>
          <FormItem name="email" className="w-8/12  m-0">
            <Input
              type="email"
              className="userInput disabled:text-gray-700"
              disabled
            />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">Job Designation</label>
          <FormItem name="jobStatus" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">Job Location</label>
          <FormItem name="jobLocation" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">Year of Graduation</label>
          <FormItem name="yearOfGraduation" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">Institute</label>
          <FormItem name="institute" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">Address</label>
          <FormItem name="address" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">City</label>
          <FormItem name="city" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex items-center flex-grow my-7">
          <label className="w-80">Country</label>
          <FormItem name="country" className="w-8/12  m-0">
            <Input className="userInput" />
          </FormItem>
        </div>

        <div className="flex gap-3 items-center flex-grow my-7">
          <div className="w-80">
            <label>College Card/ CNIC Picture</label>
          </div>
          <div className="flex gap-3 w-8/12  m-0">
            {/* CNIC Front */}
            <FormItem name="cnicFront" noStyle>
              <UploadPics form={form} type="front" />
            </FormItem>

            {/* CNIC Back */}
            <FormItem name="cnicBack" noStyle>
              <UploadPics form={form} type="back" />
            </FormItem>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-[#F9954B] rounded-3xl px-12 text-[#fff] py-2 mt-4 mr-10"
            type="submit"
            onClick={onSave}
          >
            Submit
          </button>
        </div>
      </div>
    </Form>
  );
}
