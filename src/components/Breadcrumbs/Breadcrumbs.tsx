"use client";

import { formatSlug } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ItemProps = {
    slug: string;
    path: string;
};

type ItemBreadcrumbsProps = {
    items: ItemProps[];
};

const Breadcrumbs: React.FC<ItemBreadcrumbsProps> = ({ items }) => {
    const pathName = usePathname();
    const defaultPath: ItemProps[] = [
        {
            path: "Home",
            slug: "/",
        },
        ...items,
    ];
    const isLastItem = (slug: string) => {
        // So sánh theo slug (không phân biệt hoa/thường) thay vì tên hiển
        // thị: tên có thể chứa ký tự không có trong URL (#, &, khoảng trắng).
        const pathSegments = pathName.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1] ?? "";
        const itemSegments = formatSlug(slug)
            .split("/")
            .filter(Boolean);
        const itemLast = itemSegments[itemSegments.length - 1] ?? "";
        try {
            return (
                decodeURIComponent(lastSegment).toLowerCase() ===
                decodeURIComponent(itemLast).toLowerCase()
            );
        } catch {
            return lastSegment.toLowerCase() === itemLast.toLowerCase();
        }
    };

    return (
        <div className="breadcrumbs text-base font-normal text-(--text-color-title)">
            <ul>
                {defaultPath.map((item, key) => {
                    // Callers pass slugs with a leading "/" (e.g. "/blog") —
                    // strip it so the href doesn't become "//blog".
                    const formatSlugItem = formatSlug(item.slug).replace(
                        /^\/+/,
                        "",
                    );
                    const isLast = isLastItem(item.slug);
                    return (
                        <li key={key}>
                            {isLast ? (
                                <span className="pointer-events-none">
                                    {item.path}
                                </span>
                            ) : (
                                <Link href={`/${formatSlugItem}`}>
                                    {item.path}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
export default Breadcrumbs;
