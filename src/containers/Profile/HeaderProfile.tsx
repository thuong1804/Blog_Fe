"use client";

import { useAuth } from "@/context/AuthContext/AuthContext";
import { renderImage } from "@/utils";
import { usePathname } from "next/navigation";

const HeaderProfile = () => {
    const pathName = usePathname();
    const formatPathName = pathName.split("/")[2];
    const { user } = useAuth();

    const labelPathName: Record<string, string> = {
        ["edit-profile"]: "Edit Profile",
        ["password"]: "Password",
    };

    return (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="avatar shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                    {renderImage(user?.avatar)}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <p className="text-base sm:text-lg md:text-2xl text-black font-normal truncate max-w-[140px] sm:max-w-none">
                    {user?.name}
                </p>

                <span className="text-base sm:text-lg md:text-2xl text-gray-400">
                    /
                </span>

                <p className="text-base sm:text-lg md:text-2xl text-black font-normal truncate max-w-[140px] sm:max-w-none">
                    {labelPathName[formatPathName]}
                </p>
            </div>
        </div>
    );
};
export default HeaderProfile;
