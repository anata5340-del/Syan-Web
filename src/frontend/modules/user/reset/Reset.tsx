import axios from "axios";
import React, { useEffect, useState } from "react";
import { userStore } from "@/store/user/user";
import { decodeJwt } from "jose";
import { Token } from "@/backend/middlewares/jose";
import { useRouter } from "next/router";
import Slider from "react-slick";
import { Form, Input, Modal } from "antd";
import Image from "next/image";
import toast from "react-hot-toast";
import { Logo } from "../../../../../public/assets/img/logo.tsx";
import { Slider1 } from "../../../../../public/assets/img/slider1.tsx";
import { Slider2 } from "../../../../../public/assets/img/slider2.tsx";
import { Slider3 } from "../../../../../public/assets/img/slider3.tsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Reset: React.FC = () => {
  const { setAdmin, setUser } = userStore((state) => state);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setUser(null);
    setAdmin(null);
  }, []);

  const showOtpModal = () => {
    setIsOtpModalVisible(true);
    sendOtp("password");
  };
  const sendOtp = async (updateType: "email" | "password") => {
    try {
      const { data } = await axios.post("/api/users/validate", {
        type: updateType,
        email,
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
        setEmailConfirmed(true);
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

  const changePassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.error("Missing required fields!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      const { data } = await axios.put("/api/users/reset-password", {
        id: userId,
        email,
        password: newPassword,
        type: userType,
      });
      toast.success("Password successfully reset.");
      if (userType === "user") {
        setUser(data.data);
        router.push("/user");
      } else {
        setAdmin(data.data);
        router.push("/admin");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    // setEmailConfirmed(false);
  };
  const validateEmail = async () => {
    try {
      const { data } = await axios.post("/api/users/reset-password", {
        email,
      });
      setUserType(data.type);
      setUserId(data.id);
      showOtpModal();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    // setEmailConfirmed(true);
    // showOtpModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Removes previous/next buttons
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="custom-dots">{dots}</ul>
      </div>
    ),
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-white"
      style={{
        marginLeft: "-5rem", // Negates the parent's padding (10px = 2.5rem)
        marginRight: "-5rem", // Negates the parent's padding (10px = 2.5rem)
        padding: "0", // Resets the padding inside this div
        overflow: "hidden", // Ensures no scrolling
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[56%,44%] w-screen h-screen">
        {/* Left Section - Slider */}
        <div className="hidden md:flex flex-col justify-around bg-[#FAFAFA]">
          <div className="mx-auto -mb-20">
            <Logo />
          </div>
          <Slider {...sliderSettings}>
            <div>
              <Slider1 />
              <h3 className="font-bold text-center text-xl my-5">
                Welcome to SYAN
              </h3>
              <p className="m-auto text-center w-3/5 mb-3">
                SYAN Academy for medical learning and professional growth.
                tailored to your needs.
              </p>
            </div>
            <div>
              <Slider2 />
              <h3 className="font-bold text-center text-xl my-5">
                Learning path
              </h3>
              <p className="m-auto text-center w-3/5 mb-3">
                Choose your learning path. Select your area of interest and
                start learning.
              </p>
            </div>
            <div>
              <Slider3 />
              <h3 className="font-bold text-center text-xl my-5">
                Start learning
              </h3>
              <p className="m-auto text-center w-3/5 mb-3">
                Start learning! Access our video lectures, quizzes, and more.
              </p>
            </div>
          </Slider>
        </div>

        {/* Right Section - Reset Form */}
        <div className="flex flex-col justify-center w-3/5 m-auto">
          <p
            onClick={() => {
              router.back();
            }}
            className="cursor-pointer mb-2"
          >
            🡰 <span className="underline">Back to login page</span>
          </p>
          <h1 className="text-3xl font-bold text-[#4F4F4F] mb-6">
            Reset Your Password.
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-[#EF6A77]">
              {!emailConfirmed ? "Confirm your Email" : "Change Password"}
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              {!emailConfirmed ? (
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DA397]"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DA397]"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DA397]"
                      required
                    />
                  </div>
                </>
              )}
              <button
                disabled={isSubmitting}
                onClick={emailConfirmed ? changePassword : validateEmail}
                type="submit"
                className="w-full bg-[#EF6A77] text-white py-2 px-4 rounded-md hover:bg-[#3DA397] transition-colors duration-300"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .custom-dots li button:before {
          font-size: 10px;
          color: #cccccc;
        }
        .custom-dots li.slick-active button:before {
          color: #ef6a77;
        }
      `}</style>
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
    </div>
  );
};

export default Reset;
