import React, { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import FormItem from "antd/es/form/FormItem";
import { userStore } from "@/store/user/user";
import { User } from "@/backend/types";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Security() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { user, setUser } = userStore();

  const [newEmail, setNewEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [otpFor, setOtpFor] = useState<"email" | "password" | null>(null);

  const showOtpModal = (updateType: "email" | "password") => {
    if (updateType === "email") {
      if (!newEmail) {
        toast.error("Email is required!");
        return;
      }
    } else if (updateType === "password") {
      if (!newPassword || !currentPassword) {
        toast.error("Missing required fields!");
        return;
      }

      // Validate password fields
      if (currentPassword !== user.password) {
        toast.error("Current password is incorrect.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }
    }
    setOtpFor(updateType);
    setIsOtpModalVisible(true);
    sendOtp(updateType);
  };
  const sendOtp = async (updateType: "email" | "password") => {
    try {
      const { data } = await axios.post("/api/users/validate", {
        type: updateType,
        email: user.email,
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
        if (otpFor === "email") updateEmail(); // Call email update function
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

  const updateEmail = async () => {
    try {
      const formData = new FormData();

      Object.keys(user).forEach((key) => {
        formData.append(`user[${key}]`, user[key]);
      });

      // Update email
      formData.delete("user[email]");
      formData.append("user[email]", newEmail.trim());
      formData.delete("user[packages]");

      const { data } = await axios.put<{ user: User }>(
        `/api/users/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      form.setFieldValue("email", "");
      setUser(data.user);
      toast.success(`Email updated successfully`);
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Failed to update email: ${error?.response?.data?.error?.message}`
      );
    }
  };

  const updatePassword = async () => {
    try {
      const formData = new FormData();

      Object.keys(user).forEach((key) => {
        formData.append(`user[${key}]`, user[key]);
      });

      // Update password
      formData.delete("user[password]");
      formData.append("user[password]", newPassword);
      formData.delete("user[packages]");

      const { data } = await axios.put<{ user: User }>(
        `/api/users/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      form.setFieldValue("currentPassword", "");
      form.setFieldValue("newPassword", "");
      form.setFieldValue("confirmPassword", "");
      setUser(data.user);
      toast.success(`Password updated successfully`);
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Failed to update password: ${error?.response?.data?.error?.message}`
      );
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`/api/users/${user._id}`);
      toast.success("User deleted successfully");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <Form form={form}>
        <div className="p-10 pt-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-3xl text-[#268A9B] font-medium">Security</h2>
              <p>Edit your account settings and change your password here.</p>
            </div>
            <div>
              <h2 className="text-2xl font-medium">Email Address</h2>
              <p>
                Your current email address is <strong> {user?.email}</strong>
              </p>
              <p>
                We will email you an otp when changing your email, so please
                expect that email after submitting.
              </p>
            </div>
          </div>

          <div className="flex flex-col flex-grow mt-3">
            <label className="w-80 text-xl">New Email Address</label>
            <FormItem name="email" className="w-5/12">
              <Input
                type="email"
                className="userInput"
                onChange={(e) => {
                  setNewEmail(e.target.value);
                }}
              />
            </FormItem>
            <div className="flex">
              <button
                className="bg-[#268A9B] rounded-3xl px-12 text-[#fff] py-2"
                type="button"
                onClick={() => showOtpModal("email")}
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
                    onClick={() => showOtpModal("password")}
                  >
                    Update Password
                  </button>
                </div>

                <div className="flex">
                  <button
                    className="bg-[#FF021B] rounded-3xl px-12 text-[#fff] py-2 mt-4"
                    type="button"
                    onClick={() => setIsDeleteModalVisible(true)}
                  >
                    Delete Account
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
      {/* DELTE Modal */}
      <Modal
        title={
          <div
            style={{
              padding: "0.5rem",
              backgroundColor: "red",
              textAlign: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Are You Sure?
          </div>
        } // Custom styling for title
        open={isDeleteModalVisible}
        onOk={deleteUser}
        onCancel={() => setIsDeleteModalVisible(false)}
        closeIcon={false}
        footer={[
          <div className="p-2 pt-0 flex justify-center">
            <button
              className="py-2 px-4  bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
              key="cancel"
              onClick={() => setIsDeleteModalVisible(false)}
            >
              Cancel
            </button>
            <button
              className="py-2 px-4 ml-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              key="submit"
              onClick={() => deleteUser()}
            >
              Confirm
            </button>
          </div>,
        ]}
      ></Modal>
    </>
  );
}
