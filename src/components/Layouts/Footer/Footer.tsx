import SubscribeEmail from "@/containers/LandingPage/SubscribeEmail/SubscribeEmail";
import Link from "next/link";
import React from "react";
import { FaBlogger } from "react-icons/fa";

const FooterLayout = () => {
    const slug = [
        { title: "Home", path: "/" },
        { title: "Blog", path: "/blog" },
        { title: "About", path: "/about" },
        { title: "Contact Us", path: "/contact" },
    ];

    const contacts = [
        { title: "FB", href: "https://www.facebook.com/Thuongpro40/" },
        { title: "IG", href: "https://www.instagram.com/lehoaithuong20/" },
        { title: "IN", href: "https://www.linkedin.com/in/hoai-thuong1804/" },
        { title: "YT", href: "" },
    ];

    return (
        <>
            <SubscribeEmail />

            <footer className="bg-white py-10 lg:py-12">
                <div className="max-w-(--max-width-desktop) mx-auto px-5">
                    <div className="flex flex-col items-center gap-8 lg:gap-10">
                        {/* LOGO */}
                        <div className="flex items-center gap-2">
                            <FaBlogger className="text-4xl md:text-5xl lg:text-[70px] text-(--text-color-title)" />
                            <span className="font-bold text-xl md:text-2xl lg:text-3xl text-(--text-color-title)">
                                TECHNEWS
                            </span>
                        </div>

                        {/* MENU */}
                        <nav className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
                            {slug.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="text-sm md:text-base text-slate-700 hover:text-blue-600 transition-colors"
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>

                        {/* SOCIAL */}
                        <div className="flex items-center gap-3">
                            {contacts.map((item, key) => (
                                <Link
                                    key={key}
                                    href={item.href}
                                    target="_blank"
                                    className="
                                        w-9 h-9
                                        md:w-10 md:h-10
                                        rounded-full
                                        bg-slate-900
                                        hover:bg-blue-600
                                        text-white
                                        flex items-center justify-center
                                        transition-all duration-300
                                        hover:scale-110
                                        shadow-sm
                                    "
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>

                        {/* DIVIDER */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                        {/* COPYRIGHT */}
                        <p className="text-xs md:text-sm text-(--text-color-title) text-center">
                            Copyright Ideapeel Inc © 2026. All Right Reserved
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterLayout;
