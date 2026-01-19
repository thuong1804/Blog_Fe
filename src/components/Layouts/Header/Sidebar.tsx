'use client'

import SearchBar from "@/components/SearchBar/SearchBar";
import { IoIosMenu } from "react-icons/io";
import DropdownInfoProfile from "./DropdownInfoProfile";
import Link from "next/link";
import { AuthorPageProps } from "@/type/typeProps";
import CategoriesPage from "@/containers/Categories/Categories";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { path } from "@/constant/path";

type SidebarUser = AuthorPageProps["user"];

type SideBarProps = {
    user:SidebarUser;
    itemMenu: {
        href: string;
        title: string;
    }[];
};

const SideBar = ({ user, itemMenu }: SideBarProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const pathName = usePathname();
    const itemPath = [path.contact, path.createPost];
    const isHideCategories = itemPath.some((item) => pathName.includes(item));

    const onHandleClickLink = () => {
        setIsOpen(false)
    }

    return (
        <div className="drawer drawer-end">
            <input
                id="mobile-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
            />

            <div className="drawer-content w-full flex justify-end">
                <button
                    className="btn btn-ghost lg:hidden"
                    onClick={() => setIsOpen(true)}
                >
                    <IoIosMenu className="text-3xl" />
                </button>
            </div>

            <div className="drawer-side z-50">
                <div
                    className="drawer-overlay"
                    onClick={() => setIsOpen(false)}
                />

                <ul className="menu bg-white min-h-full w-[90%] p-6 pt-7 gap-3">
                    <div><SearchBar /></div>
                    {!isHideCategories && (
                        <React.Fragment>
                            <div className="mt-2">Categories</div>
                            <CategoriesPage onClickLink={onHandleClickLink} />
                        </React.Fragment>
                    )}

                    <div className="border-t-2">
                        {itemMenu.map((item, key) => (
                            <li key={key}>
                                <Link
                                    href={item.href}
                                    className="font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </div>

                    <li className="pt-2 w-max">
                        <DropdownInfoProfile user={user} />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar;