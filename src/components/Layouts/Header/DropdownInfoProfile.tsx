'use client'

import { path } from "@/constant/path";
import { AuthorPageProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { IoIosSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";

export default function DropdownInfoProfile({user}: AuthorPageProps) {

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        console.log("Logout successful");
        window.location.href = "/";
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
      <>
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:bg-white active:bg-transparent focus:bg-transparent"
            >
              <div className="w-10 rounded-full relative">
                <Image alt={user.name || "User avatar"} src={user.avatar} fill />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="text-white menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
            <li><Link href={path.profile}><ImProfile className="text-[18px]"/> Profile</Link></li>
            <li><a><IoIosSettings className="text-[18px]" />Settings</a></li>
            <li>
              <button onClick={handleLogout}>
                <IoLogOutOutline className="text-[18px]" />
                Logout
              </button>
            </li>
            </ul>
          </div>
        ) : (
          <Link href={path.signin}>
            <FaUser className="text-xl active:scale-105 hover:scale-110 transition cursor-pointer" />
          </Link>
        )}
      </>
    );
}