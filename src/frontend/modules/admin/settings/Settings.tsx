import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import FormItem from "antd/es/form/FormItem";
import { userStore } from "@/store/user/user";
import { User } from "@/backend/types";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BannerPromotionModal from "./BannerPromotionModal";
import SubAdminsModal from "./SubAdminsModal";

export default function Settings() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { admin, setAdmin } = userStore();

  const [userName, setUserName] = useState<string>(admin?.username);
  useEffect(() => {
    setUserName(admin?.username);
    form.setFieldValue("userName", admin?.username);
  }, [admin?.username]);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [isPromotionsModalVisible, setIsPromotionsModalVisible] =
    useState(false);
  const [isSubAdminsModalVisible, setIsSubAdminsModalVisible] = useState(false);

  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [otpFor, setOtpFor] = useState<"email" | "password" | null>(null);

  const showOtpModal = () => {
    if (!newPassword || !currentPassword) {
      toast.error("Missing required fields!");
      return;
    }
    // Validate password fields
    if (currentPassword !== admin.password) {
      toast.error("Current password is incorrect.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setOtpFor("password");
    setIsOtpModalVisible(true);
    sendOtp("password");
  };
  const sendOtp = async (updateType: "email" | "password") => {
    try {
      const { data } = await axios.post("/api/users/validate", {
        type: updateType,
        email: admin.email,
      });
      setToken(data.token);
      toast.success("OTP sent to your email.");
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to send OTP: ${error?.response?.data?.error}`);
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post("/api/users/validate/verify", {
        otp,
        token,
      });

      if (data.success) {
        toast.success("OTP verified successfully.");
        if (otpFor === "password") updatePassword(); // Call password update function
        setIsOtpModalVisible(false);
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to verify OTP: ${error?.response?.data?.error}`);
    } finally {
      setOtp("");
    }
  };

  const updateUsername = async () => {
    if (!userName) {
      toast.error("User Name is required!");
      return;
    }
    try {
      const response = await axios.put(`/api/admins?id=${admin._id}`, {
        ...admin,
        username: userName,
      });
      setAdmin(response.data); // Update admin state with the new data
      toast.success("Username updated successfully");
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username");
    }
  };

  const updatePassword = async () => {
    try {
      const response = await axios.put(`/api/admins?id=${admin._id}`, {
        ...admin,
        password: newPassword,
      });
      setAdmin(response.data); // Update admin state with the new data
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <>
      <Form form={form}>
        <div className="p-10 pt-6">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl text-[#268A9B] font-medium">
                  Account Settings
                </h2>
                <p>Edit your account settings and change your password here.</p>
              </div>
              {admin?.role === "superadmin" && (
                <div className="flex gap-3">
                  <button
                    className="bg-[#268A9B] text-white px-4 py-2 rounded-3xl"
                    onClick={() => setIsPromotionsModalVisible(true)}
                  >
                    Promotions
                  </button>
                  <button
                    className="bg-[#F4A261] text-white px-4 py-2 rounded-3xl"
                    onClick={() => setIsSubAdminsModalVisible(true)}
                  >
                    Admin Users
                  </button>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-medium">Email Address</h2>
              <p>
                Your current email address is <strong> {admin?.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col flex-grow mt-3">
            <label className="w-80 text-xl">User Name</label>
            <FormItem name="userName" className="w-5/12">
              <Input
                type="text"
                className="userInput"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </FormItem>
            <div className="flex">
              <button
                className="bg-[#268A9B] rounded-3xl px-12 text-[#fff] py-2"
                type="button"
                onClick={updateUsername}
              >
                Update
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-7">
            <div className="mb-4">
              <h2 className="text-2xl font-medium">Change Password</h2>
              <p>
                We will email you an otp when changing your password, so please
                expect that email after submitting.
              </p>
            </div>

            <div className="flex flex-col flex-grow">
              <label className="w-80 text-xl">Current Password</label>
              <FormItem name="currentPassword" className="w-5/12">
                <Input
                  type="password"
                  className="userInput"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </FormItem>

              <div className="flex flex-col flex-grow">
                <label className="w-80 text-xl">New Password</label>
                <FormItem name="newPassword" className="w-5/12">
                  <Input
                    type="password"
                    className="userInput"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormItem>
              </div>

              <div className="flex flex-col flex-grow">
                <label className="w-80 text-xl">Confirm Password</label>
                <FormItem name="confirmPassword" className="w-5/12">
                  <Input
                    type="password"
                    className="userInput"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </FormItem>
                <div className="flex">
                  <button
                    className="bg-[#268A9B] rounded-3xl px-12 text-[#fff] py-2"
                    type="button"
                    onClick={() => showOtpModal()}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
      {/* OTP Modal */}
      <Modal
        title={
          <div
            style={{
              padding: "0.5rem",
              backgroundColor: "#1890ff",
              textAlign: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Enter OTP
          </div>
        } // Custom styling for title
        open={isOtpModalVisible}
        onOk={verifyOtp}
        onCancel={() => setIsOtpModalVisible(false)}
        closeIcon={false}
        footer={[
          <div
            style={{
              padding: "1rem",
              paddingTop: "0",
              paddingBottom: "0.5rem",
            }}
          >
            <button
              className="py-2 px-4  bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
              key="cancel"
              onClick={() => setIsOtpModalVisible(false)}
            >
              Cancel
            </button>
            <button
              className="py-2 px-4 ml-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              key="submit"
              onClick={verifyOtp}
            >
              Submit
            </button>
          </div>,
        ]}
      >
        <div className="p-4 pb-0">
          <Input
            placeholder="Enter the 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6} // Ensure user can only type a 6-digit OTP
          />
        </div>
      </Modal>
      <BannerPromotionModal
        isModalVisible={isPromotionsModalVisible}
        setIsModalVisible={setIsPromotionsModalVisible}
      />
      <SubAdminsModal
        isModalVisible={isSubAdminsModalVisible}
        setIsModalVisible={setIsSubAdminsModalVisible}
      />
    </>
  );
}
