import axios from "axios";
import React, { useEffect, useState } from "react";
import { userStore } from "@/store/user/user";
import { useRouter } from "next/router";
import Slider from "react-slick";
import Link from "next/link";
import { Logo } from "../../../../../public/assets/img/logo.tsx";
import { Slider1 } from "../../../../../public/assets/img/slider1.tsx";
import { Slider2 } from "../../../../../public/assets/img/slider2.tsx";
import { Slider3 } from "../../../../../public/assets/img/slider3.tsx";
import toast from "react-hot-toast";
import { Button } from "antd";
import UserProfile from "@/frontend/components/userProfile/userProfile";
import { useForm } from "antd/es/form/Form";
import { User } from "@/backend/types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SignUp: React.FC = () => {
  const { setAdmin, setUser, setFavourites } = userStore((state) => state);
  const router = useRouter();
  const [form] = useForm();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUser(null);
    setAdmin(null);
    setFavourites(null);
    form.resetFields();
  }, []);

  const handleOk = async () => {
    const formData = new FormData();
    const values = form.getFieldsValue();

    // Validate password match
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!values.password || values.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Add all form values to formData
    Object.keys(values).forEach((key) => {
      formData.append(`user[${key}]`, values[key]);
      console.log(key, values[key], "Came Here 1 =>>>>>");
    });

    // Remove unnecessary fields
    formData.delete("user[image]");
    formData.delete("user[cnicFront]");
    formData.delete("user[cnicBack]");
    formData.delete("user[_id]");
    formData.delete("user[confirmPassword]");

    // Append files if present
    if (values.image?.file?.originFileObj) {
      formData.append("user[image]", values.image.file.originFileObj);
    }
    if (values.cnicFront?.file?.originFileObj) {
      formData.append("user[cnicFront]", values.cnicFront.file.originFileObj);
    }
    if (values.cnicBack?.file?.originFileObj) {
      formData.append("user[cnicBack]", values.cnicBack.file.originFileObj);
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Check email availability
      // const emailCheckResponse = await axios.post("/api/users/check-email", {
      //   email: values.email,
      // });

      // if (!emailCheckResponse.data.available) {
      //   toast.error(
      //     "The email is already in use. Please use a different email."
      //   );
      //   setIsSubmitting(false);
      //   return;
      // }

      // Make the request to create the user
      const { data } = await axios<{ user: User }>("/api/users", {
        data: formData,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);

      // Reset form
      form.resetFields();
      setIsSubmitting(false);

      // Show success message with approval notice
      toast.success(
        "Account created successfully! Your account is under review. We will let you know shortly.",
        { duration: 6000 }
      );

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setIsSubmitting(false);
      setError(
        error?.response?.data?.error?.message ||
          "Failed to create account. Please try again."
      );
      toast.error(
        `Account Creation Failed: ${
          error?.response?.data?.error?.message ||
          "Please check all fields and try again"
        }`
      );
    }
  };

  const handleCancel = () => {
    router.push("/login");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
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
        marginLeft: "-5rem",
        marginRight: "-5rem",
        padding: "0",
        paddingTop: "2rem",
        overflow: "auto",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[30%,70%] w-screen min-h-screen">
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

        {/* Right Section - Sign Up Form */}
        <div className="flex flex-col justify-start w-full md:w-full m-auto p-4 md:p-6 pt-8">
          <h1 className="text-3xl font-bold text-[#4F4F4F] mb-6">
            Join SYAN Academy! Create your account 🩺
          </h1>
          <div className="bg-white rounded-lg shadow-md">
            {error && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <div className="bg-white">
              <UserProfile form={form} />
            </div>
            <div className="flex gap-5 justify-end py-5 px-10 border-t">
              <Button
                className="cancelBtn"
                type="primary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="saveBtn"
                type="primary"
                onClick={handleOk}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Sign Up
              </Button>
            </div>
          </div>
          <p className="m-2 text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#EF6A77]">
              Log in here
            </Link>
          </p>
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
    </div>
  );
};

export default SignUp;
