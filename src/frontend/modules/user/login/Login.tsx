import axios from "axios";
import React, { useEffect, useState } from "react";
import { userStore } from "@/store/user/user";
import { decodeJwt } from "jose";
import { Token } from "@/backend/middlewares/jose";
import { useRouter } from "next/router";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../../../../../public/assets/img/logo.tsx";
import { Slider1 } from "../../../../../public/assets/img/slider1.tsx";
import { Slider2 } from "../../../../../public/assets/img/slider2.tsx";
import { Slider3 } from "../../../../../public/assets/img/slider3.tsx";
import Loading from "@/frontend/components/loading/Loading";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Login: React.FC = () => {
  const { setAdmin, setUser, setFavourites, getFavourites } = userStore(
    (state) => state
  );
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUser(null);
    setAdmin(null);
    setFavourites(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      if (response.status === 200) {
        const tokenData = decodeJwt(response.data.token) as Token;

        // Extract user or admin data

        if (tokenData.admin) {
          const admin = response.data.admin;

          // Set admin data for superadmin or subadmin
          setAdmin(admin);
          setUser(null); // No user details for admin
          router.push("/admin");
        } else {
          const user = response.data.user;
          // Set user data for regular users
          setUser(user);
          setAdmin(null); // Clear admin attributes
          getFavourites();
          router.push("/user");
        }
      }
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMessage =
        err?.response?.data?.message || "Invalid Email or Password";
      setError(errorMessage);
    }
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
    <>
      <Loading isLoading={isSubmitting} message="Logging in..." />
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

          {/* Right Section - Login Form */}
          <div className="flex flex-col justify-center w-3/5 m-auto">
            <h1 className="text-3xl font-bold text-[#4F4F4F] mb-6">
              Welcome! Ready to learn? Log in! 🩺
            </h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-[#EF6A77]">Login</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <form onSubmit={handleSubmit}>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DA397]"
                    required
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#EF6A77] text-white py-2 px-4 rounded-md hover:bg-[#3DA397] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </form>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="w-full bg-[#3DA397] text-white py-2 px-4 rounded-md hover:bg-[#EF6A77] transition-colors duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <p className="m-2 ">
              Forgot Password?{" "}
              <Link href="/reset-password" className="text-[#EF6A77]">
                Reset here
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
    </>
  );
};

export default Login;
