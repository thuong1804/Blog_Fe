"use client";

import { path } from "@/constant/path";
import { AuthorPageProps } from "@/type/typeProps";
import { renderImage } from "@/utils";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdListAlt } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

type DropdownInfoProfileProps = {
    user: AuthorPageProps["user"];
    position?: "left" | "right" | "top" | "bottom";
};

export default function DropdownInfoProfile({ user, position }: DropdownInfoProfileProps) {
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
                <div className={`dropdown ${position ? `dropdown-${position}` : ''}  `}>
                    <div
                        tabIndex={0}
                        role="button"
                        className="
                btn
                btn-ghost
                btn-circle
                avatar
                hover:bg-transparent
                focus:bg-transparent
                active:bg-transparent
            "
                    >
                        <div className="
                w-10
                h-10
                rounded-full
                ring-2
                ring-primary
                ring-offset-2
                ring-offset-base-100
                overflow-hidden
            ">
                            {renderImage(user.avatar)}
                        </div>
                    </div>

                    <ul
                        tabIndex={0}
                        className="
                dropdown-content
                z-50
                mt-3
                w-52
                rounded-xl
                bg-base-100
                p-2
                shadow-lg
                border
                border-base-200
                text-base-content
            "
                    >
                        <li>
                            <Link
                                href={path.editUser}
                                className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2
                        hover:bg-base-200
                        transition
                    "
                            >
                                <ImProfile className="text-lg opacity-80" />
                                <span>Profile</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href={`${path.author}/${user.handle}`}
                                className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2
                        hover:bg-base-200
                        transition
                    "
                            >
                                <MdListAlt className="text-lg opacity-80" />
                                <span>Posts</span>
                            </Link>
                        </li>

                        <li className="mt-1 border-t border-base-200 pt-1">
                            <button
                                onClick={handleLogout}
                                className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2
                        text-error
                        hover:bg-error/10
                        transition
                    "
                            >
                                <IoLogOutOutline className="text-lg" />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            ) : (
                <Link
                    href={path.signin}
                    className="
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-full
            hover:bg-base-200
            transition
        "
                >
                    <FaUser className="text-xl" />
                </Link>
            )}

        </>
    );
}
