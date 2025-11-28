import { userStore } from "@/store/user/user";
import Link from "next/link";
import Calendar from "./Calendar";
import { useEffect, useState } from "react";
import axios from "axios";

const RightSidebar = () => {
  const [image, setImage] = useState<string>("");
  const [link, setLink] = useState<string>("");

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      const { data } = response;
      if (data) {
        setLink(data.promotionLink);
        setImage(data.image);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error.message);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const { user } = userStore();
  return (
    <div className="flex flex-col justify-center items-center w-2/6">
      <div className="flex flex-col items-center py-3">
        <img
          style={{ height: "150px", width: "150px" }}
          alt="user placeholder"
          className="rounded-full"
          src={user?.image ? user.image : "/assets/img/user_placeholder.png"}
        />
        <p className="text-[#277C72] text-lg font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
        <p className="text-sm">ID: {user?.displayId}</p>
      </div>
      <Calendar />
      <div className="flex flex-col items-center justify-center mt-5">
        <p className="text-[#EF6A77] text-xl font-semibold">Upcoming News</p>
        <img src={image ?? "/assets/img/icon34.png"} />
        <Link
          href={link ?? "#"}
          rel="noopener noreferrer"
          target="_blank"
          className="block mt-2 bg-white rounded-2xl text-[#076BB4] font-semibold drop-shadow-md w-32 text-center py-2"
        >
          Get Access
        </Link>
      </div>
    </div>
  );
};

export default RightSidebar;
