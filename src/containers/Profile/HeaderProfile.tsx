"use client";

import { useAuth } from "@/context/AuthContext/AuthContext";
import { renderImage } from "@/utils/render";
import { usePathname } from "next/navigation";

const HeaderProfile = () => {
    const pathName = usePathname();
    const formatPathName = pathName.split("/")[2];
    const { user } = useAuth();

    const labelPathName: Record<string, string> = {
        ["edit-profile"]: "Edit Profile",
        ["password"]: "Password",
    };

    const subtitle: Record<string, string> = {
        ["edit-profile"]: "Manage your public profile, avatar and personal details",
        ["password"]: "Keep your account secure with a strong password",
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Cover */}
            <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 sm:h-36">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
                        backgroundSize: "22px 22px",
                    }}
                />
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute -left-8 bottom-0 h-28 w-56 rounded-full bg-black/10 blur-2xl" />
            </div>

            <div className="flex flex-wrap items-center gap-4 px-5 pb-5 sm:px-7">
                <div className="avatar -mt-8 shrink-0 sm:-mt-10">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-white shadow-lg sm:h-20 sm:w-20">
                        {renderImage(user?.avatar)}
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span>Profile</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-blue-600">
                                {labelPathName[formatPathName]}
                            </span>
                        </div>
                        <h1 className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                            {user?.name || "Your profile"}{" "}
                            <span className="font-normal text-slate-400">
                                / {labelPathName[formatPathName]}
                            </span>
                        </h1>
                        <p className="mt-0.5 truncate text-sm text-slate-500">
                            {subtitle[formatPathName] ||
                                "Manage your account settings"}
                            {user?.handle && (
                                <span className="ml-2 hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 sm:inline-block">
                                    @{user.handle}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HeaderProfile;
