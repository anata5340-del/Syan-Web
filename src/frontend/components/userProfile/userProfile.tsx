import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, message, Upload } from "antd";
import type { FormInstance, GetProp, UploadProps } from "antd";
import UploadPics from "./uploadPics";
import FormItem from "antd/es/form/FormItem";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type Props = {
  form: FormInstance;
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

export default function UserProfile({ form }: Props) {
  const baseUrl = process.env.BASE_URL;

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>();

  useEffect(() => {
    setImageUrl(
      form.getFieldsValue().image ? `${form.getFieldValue("image")}` : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="bg-colordarkblue py-2 flex justify-center text-white text-2xl">
        User Profile
      </div>
      <div className="px-10 pt-6">
        <div className="flex gap-12">
          <div className="flex flex-col justify-center items-center">
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
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </FormItem>
            <p className="mt-2 uppercase text-[#1C1C1C] font-bold text-xs">
              Upload Image
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex justify-start items-center">
              <label className="w-1/3">First Name</label>
              <FormItem name="firstName">
                <Input className="userInput" />
              </FormItem>
            </div>
            <div className="flex justify-start items-center">
              <label className="w-1/3">Last Name</label>
              <FormItem name="lastName">
                <Input className="userInput" />
              </FormItem>
            </div>
            <div className="flex justify-start items-center">
              <label className="w-1/3">Email</label>
              <FormItem name="email">
                <Input type="email" className="userInput" />
              </FormItem>
            </div>
          </div>
        </div>

        <div>
          <div className="flex gap-3 mt-3">
            <div className="w-1/2">
              <label>Password</label>
              <FormItem name="password">
                <Input.Password className="userInput" />
              </FormItem>
            </div>
            <div className="w-1/2">
              <label>Confirmed Password</label>
              <FormItem name="confirmPassword">
                <Input.Password className="userInput" />
              </FormItem>
            </div>
          </div>
          <div className="flex gap-3 flex-grow mt-3">
            <div className="w-1/2">
              <label>Contact Number</label>
              <FormItem name="phone">
                <Input className="userInput" />
              </FormItem>
            </div>
            <div className="w-1/2">
              <label>CNIC/Passport No</label>
              <FormItem name="cnic">
                <Input className="userInput" />
              </FormItem>
            </div>
          </div>
          <div className="flex gap-3 flex-grow mt-3">
            <div className="w-1/2">
              <label>Job Status</label>

              <FormItem name="jobStatus">
                <Input className="userInput" />
              </FormItem>
            </div>
            <div className="w-1/2">
              <label>Job Location</label>
              <FormItem name="jobLocation">
                <Input className="userInput" />
              </FormItem>
            </div>
          </div>
          <div className="flex gap-3 flex-grow mt-3">
            <div className="w-1/2">
              <label>Year of Graduation</label>
              <FormItem name="yearOfGraduation">
                <Input className="userInput" />
              </FormItem>
            </div>
            <div className="w-1/2">
              <label>Institute</label>
              <FormItem name="institute">
                <Input className="userInput" />
              </FormItem>
            </div>
          </div>
          <div className="flex gap-3 flex-grow mt-3">
            <div className="w-full">
              <label>Address</label>
              <FormItem name="address">
                <Input className="userInput" />
              </FormItem>
            </div>
          </div>
          <div className="flex gap-3 flex-grow mt-3">
            <div className="w-1/2">
              <label>City</label>
              <FormItem name="city">
                <Input className="userInput" />
              </FormItem>
            </div>
            <div className="w-1/2">
              <label>Country</label>
              <FormItem name="country">
                <Input className="userInput" />
              </FormItem>
            </div>
          </div>
          <div className="flex gap-3 flex-col flex-grow mt-3">
            <div className="w-1/2">
              <label>College Card/ CNIC Picture</label>
            </div>
            <div className="flex gap-3">
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
        </div>
      </div>
    </Form>
  );
}
