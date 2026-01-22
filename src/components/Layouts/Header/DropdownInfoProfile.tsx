"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdListAlt } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

import { path } from "@/constant/path";
import { AuthorPageProps } from "@/type/typeProps";
import { renderImage } from "@/utils";

type DropdownInfoProfileProps = {
    user: AuthorPageProps["user"] | null;
    position?: "start" | "end"
};

export default function DropdownInfoProfile({ user, position = "start" }: DropdownInfoProfileProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse opacity-50" />
        );
    }

    if (!user) {
        return (
            <Link
                href={path.signin}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-base-200"
            >
                <FaUser className="text-xl" />
            </Link>
        );
    }

    // 3. Render Dropdown Profile chính
    return (
        <div className={`dropdown dropdown-${position}`}>
            <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost avatar ring-primary ring-offset-base-100 hover:bg-transparent focus:bg-transparent ring-2 ring-offset-2"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    {renderImage(user.avatar)}
                </div>
            </div>

            <ul
                tabIndex={0}
                className="dropdown-content z-[50] mt-3 w-52 rounded-xl border border-base-200 bg-base-100 p-2 shadow-lg"
            >
                <DropdownItem
                    href={path.editUser}
                    icon={<ImProfile />}
                    label="Profile"
                />
                <DropdownItem
                    href={`${path.author}/${user.handle}`}
                    icon={<MdListAlt />}
                    label="Posts"
                />

                <li className="mt-1 border-t border-base-200 pt-1">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-error transition hover:bg-error/10"
                    >
                        <IoLogOutOutline className="text-lg" />
                        <span className="font-medium">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

function DropdownItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <li>
            <Link
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-base-200"
            >
                <span className="text-lg opacity-80">{icon}</span>
                <span className="font-medium">{label}</span>
            </Link>
        </li>
    );
}