"use client";

import React from "react";
import Link from "next/link";
import {
    HiOutlineShieldCheck,
    HiOutlineCode,
    HiOutlineServer,
    HiOutlineChip,
    HiOutlineGlobeAlt,
    HiOutlineSparkles
} from "react-icons/hi";

type CategoryItem = {
    id?: number;
    name: string;
    description?: string;
    slug: string;
    posts?: any[];
    children?: any[];
};

interface TopicShowcaseProps {
    categories: CategoryItem[];
}

const getCategoryIcon = (slugOrName: string) => {
    const s = slugOrName.toLowerCase();
    if (s.includes("cyber") || s.includes("security")) {
        return { icon: HiOutlineShieldCheck, color: "text-slate-900" };
    }
    if (s.includes("ai") || s.includes("data")) {
        return { icon: HiOutlineChip, color: "text-slate-900" };
    }
    if (s.includes("web")) {
        return { icon: HiOutlineGlobeAlt, color: "text-slate-900" };
    }
    if (s.includes("infra") || s.includes("cloud")) {
        return { icon: HiOutlineServer, color: "text-slate-900" };
    }
    if (s.includes("emerging") || s.includes("tech")) {
        return { icon: HiOutlineSparkles, color: "text-slate-900" };
    }
    return { icon: HiOutlineCode, color: "text-slate-900" };
};

const TopicShowcase: React.FC<TopicShowcaseProps> = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    // Filter top categories
    const displayCategories = categories.slice(0, 6);

    return (
        <section className="w-full py-12 bg-slate-50/70 border-b border-slate-200/60">
            <div className="max-w-desktop mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            Discover
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
                            Explore by Topic
                        </h2>
                    </div>
                    <p className="text-sm text-slate-500 max-w-md">
                        Deep dive into curated tech insights, tutorials, and trending industry analyses.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {displayCategories.map((cat) => {
                        const style = getCategoryIcon(cat.name || cat.slug);
                        const Icon = style.icon;
                        const postCount = (cat.posts?.length || 0) + (cat.children?.reduce((acc: number, c: any) => acc + (c.posts?.length || 0), 0) || 0);

                        return (
                            <Link
                                key={cat.slug}
                                href={`/${cat.slug}`}
                                className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1.5"
                            >
                                <div className={`w-12 h-12 rounded-xl ${style.color} flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110`}>
                                    <Icon />
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 transition-colors line-clamp-1">
                                    {cat.name}
                                </h3>
                                <span className="text-xs text-slate-400 mt-1">
                                    {postCount > 0 ? `${postCount} articles` : "Explore"}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TopicShowcase;
