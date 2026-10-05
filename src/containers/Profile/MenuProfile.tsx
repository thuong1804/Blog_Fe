"use client";

import { path } from "@/constant/path";
import { useAuth } from "@/context/AuthContext/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLock, FaUserPen } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const MenuProfile = () => {
    const pathName = usePathname();
    const formatPathName = pathName.split("/")[2];
    const { user } = useAuth();

    const itemMenu = [
        {
            title: "Edit Profile",
            desc: "Avatar, name & bio",
            slug: "edit-profile",
            icon: FaUserPen,
        },
        ...(user?.provider !== "google"
            ? [
                  {
                      title: "Password",
                      desc: "Security & login",
                      slug: "password",
                      icon: FaLock,
                  },
              ]
            : []),
    ];

    return (
        <nav className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <p className="px-3 pb-2 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Account settings
            </p>
            <div className="flex flex-row gap-2 lg:flex-col">
                {itemMenu.map((item) => {
                    const isActive = formatPathName === item.slug;
                    const Icon = item.icon;
                    return (
                        <Link
                            href={`${path.profile}/${item.slug}`}
                            key={item.slug}
                            className={twMerge(
                                "group flex flex-1 items-center gap-3 rounded-xl px-3.5 py-3 transition-all lg:flex-none",
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                                    : "text-slate-600 hover:bg-slate-100",
                            )}
                        >
                            <span
                                className={twMerge(
                                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors",
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm",
                                )}
                            >
                                <Icon className="text-[15px]" />
                            </span>
                            <span className="min-w-0">
                                <span
                                    className={twMerge(
                                        "block truncate text-[15px] font-semibold leading-tight",
                                        isActive
                                            ? "text-white"
                                            : "text-slate-800",
                                    )}
                                >
                                    {item.title}
                                </span>
                                <span
                                    className={twMerge(
                                        "block truncate text-xs",
                                        isActive
                                            ? "text-blue-100"
                                            : "text-slate-400",
                                    )}
                                >
                                    {item.desc}
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
export default MenuProfile;
