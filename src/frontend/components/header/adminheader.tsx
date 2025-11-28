"use client";

import React from "react";
import { Input } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import Link from "next/link";
import Image from "next/image";
import { userStore } from "@/store/user/user";
// import { User } from '@/backend/types';
import axios from "axios";
import { useRouter } from "next/router";

const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

export default function AdminHeader() {
  const router = useRouter();
  const { setUser, setAdmin, user, admin } = userStore((state) => state);
  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
      setUser(null);
      setAdmin(null);
      router.push("/login");
    } catch (err) {
      console.error("error signing out", err);
    }
  };
  return user || admin ? (
    <>
      <div className="flex mt-8 justify-between">
        {(user || admin) && (
          <div className="text-4xl font-semibold text-colorblue">
            Hi {user ? user.firstName : admin.username}, Good Day!
          </div>
        )}
        <div>
          {/* <Search className='headerSearch' placeholder="Search" onSearch={onSearch} style={{ width: 250}} /> */}
        </div>
        <div className="flex justify-center items-center gap-3">
          <Image src="/assets/img/icon9.png" width={20} height={20} alt="" />
          {user || admin ? (
            <button className="focus:outline-none" onClick={logout}>
              <Image
                src="/assets/img/icon10.png"
                width={20}
                height={20}
                alt=""
              />
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
