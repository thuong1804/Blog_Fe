'use client'

import SearchBar from "@/components/SearchBar/SearchBar";
import { IoIosMenu } from "react-icons/io";
import DropdownInfoProfile from "./DropdownInfoProfile";
import Link from "next/link";
import { AuthorPageProps } from "@/type/typeProps";
import CategoriesPage from "@/containers/Categories/Categories";

type SidebarUser = AuthorPageProps["user"];

type SideBarProps = {
    user: {
        data: SidebarUser;
    };
    itemMenu: {
        href: string;
        title: string;
    }[];
};

const SideBar = ({ user, itemMenu }: SideBarProps) => {
    return (
        <div className="drawer drawer-end">
            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content w-full flex justify-end">
                <label
                    htmlFor="mobile-drawer"
                    className="btn btn-ghost lg:hidden"
                >
                    <IoIosMenu className="text-3xl" />
                </label>
            </div>

            <div className="drawer-side z-50" >
                <label
                    htmlFor="mobile-drawer"
                    className="drawer-overlay"
                ></label>

                <ul className="menu bg-white min-h-full w-[90%] p-6 gap-3 relative">
                    <li><SearchBar /></li>
                    <div className="mt-2">Categories</div>
                    <CategoriesPage/>
                    <div className="border-t-2">
                        {itemMenu.map((item, key) => (
                            <li key={key}>
                                <Link href={item.href} className="font-bold">
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </div>

                    <li className="pt-2">
                        <DropdownInfoProfile user={user?.data} />
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default SideBar;