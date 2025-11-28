import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { FormInstance, Input } from "antd";
import type { GetProp, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export default function UploadPics(props: {
  form: FormInstance;
  type: string;
}) {
  const baseUrl = process.env.BASE_URL || ""; // Ensure baseUrl has a default value
  const { type, form } = props;

  // State to store preview image
  const [image, setImage] = useState<string | null>(null);

  // Set the initial image from form values
  useEffect(() => {
    const initialImage =
      type === "front"
        ? form.getFieldValue("cnicFront")
          ? `${form.getFieldValue("cnicFront")}`
          : null
        : form.getFieldValue("cnicBack")
        ? `${form.getFieldValue("cnicBack")}`
        : null;

    setImage(initialImage);
  }, []);

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fieldName = type === "front" ? "cnicFront" : "cnicBack";

      form.setFieldValue(fieldName, file); // Update form with file
      getBase64(file as FileType, (url) => {
        setImage(url);
      });
    }
  };

  return (
    <div
      onClick={() =>
        document
          .getElementById(type === "front" ? "cnicFrontInput" : "cnicBackInput")
          ?.click()
      }
      className="w-1/2 h-28 flex justify-center items-center rounded-lg border-2 border-[#1C1C1C] border-dotted cursor-pointer relative overflow-hidden"
    >
      {/* Hidden file input */}
      <Input
        id={type === "front" ? "cnicFrontInput" : "cnicBackInput"}
        type="file"
        accept="image/*"
        className="input-field1 !hidden"
        onChange={handleFileChange}
      />

      {/* Image preview or upload prompt */}
      <div className="absolute inset-0 flex justify-center items-center">
        {image ? (
          <img
            src={image}
            alt="Uploaded CNIC"
            className="w-full h-full object-fill rounded-lg"
          />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <PlusOutlined
              className="uploadColor"
              style={{ fontSize: "24px" }}
            />
            <p className="uploadColor">
              Upload {type === "front" ? "Front" : "Back"} Image
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
