import React from "react";
import { Logo } from "../../../../public/assets/img/logo.tsx";

interface LoadingProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  isLoading,
  message = "Loading...",
  fullScreen = true,
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm ${
        fullScreen ? "w-screen h-screen" : "w-full h-full"
      }`}
      style={{
        position: fullScreen ? "fixed" : "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 border-t-[#EF6A77] rounded-full animate-spin"></div>
        </div>

        {/* Loading Message */}
        {message && <p className="text-white text-sm font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
