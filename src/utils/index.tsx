import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { GENERAL_CATEGORY_SLUG } from "@/constant";

const formatSlug = (slug: string): string => {
    return slug.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
};

const joinSlugCategory = (
    parent: string | undefined,
    children: string | undefined,
    slug: string,
) => {
    // Bài thuộc category cha trực tiếp (không có parent, vd "AI & Data")
    // thì dùng "general" làm segment đầu — khớp với fallback "general" trong
    // generateStaticParams của trang chi tiết bài viết. Không để parent rỗng
    // vì sẽ sinh URL 2 đoạn (//children/slug) rơi nhầm vào route category.
    return `/${formatSlug(parent || GENERAL_CATEGORY_SLUG)}/${formatSlug(children || "")}/${slug}`;
};

const renderImage = (file: string | null | undefined) => {
    if (file) {
        return (
            <Image
                key={file}
                src={file}
                alt="preview"
                width={64}
                height={64}
                className="rounded-full object-cover"
                unoptimized
            />
        );
    } else {
        return (
            <Image
                src="/default-avatar.jpg"
                alt="default avatar"
                width={64}
                height={64}
                className="rounded-full object-cover"
                unoptimized
            />
        );
    }
};

const markdownToHtml = (md: string): string => {
    if (!md) return "";
    if (md.trim().startsWith("<") && md.includes("</")) {
        return sanitizeHtml(md);
    }

    let html = md;
    // Fenced code blocks ```lang\ncode\n```
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return `<pre><code class="language-${lang || "plaintext"}">${escaped}</code></pre>`;
    });

    // Images: ![alt](url) -> <img src="url" alt="alt" />
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Links: [text](url) -> <a href="url">$1</a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Headings: ###, ##, #
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Blockquotes: > text
    html = html.replace(/^> (.*$)/gim, "<blockquote><p>$1</p></blockquote>");

    // Paragraphs
    const lines = html.split(/\n\n+/);
    html = lines
        .map((line) => {
            const trimmed = line.trim();
            if (
                trimmed.startsWith("<h1") ||
                trimmed.startsWith("<h2") ||
                trimmed.startsWith("<h3") ||
                trimmed.startsWith("<pre") ||
                trimmed.startsWith("<blockquote") ||
                trimmed.startsWith("<img")
            ) {
                return trimmed;
            }
            if (!trimmed) return "";
            return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
        })
        .join("");

    return sanitizeHtml(html);
};

const sanitizeHtml = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
        FORBID_TAGS: [
            "script",
            "style",
            "iframe",
            "object",
            "embed",
            "form",
            "input",
            "button",
            "meta",
            "link",
            "base",
        ],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
        ALLOW_DATA_ATTR: false,
    });
};

type IdentityLike = {
    id?: string | number | null;
    email?: string | null;
    handle?: string | null;
} | null | undefined;

/**
 * Single ownership check used by every "is author?" gate (cards, detail,
 * edit form). Match by id first, fall back to email/handle for posts whose
 * author object is partially populated.
 */
const isPostAuthor = (
    user: IdentityLike,
    author: IdentityLike,
): boolean => {
    if (!user?.id || !author) return false;
    if (author.id != null && Number(user.id) === Number(author.id)) {
        return true;
    }
    if (author.email && user.email && user.email === author.email) {
        return true;
    }
    if (author.handle && user.handle && user.handle === author.handle) {
        return true;
    }
    return false;
};

/**
 * Validate a post-login return URL. Only same-origin absolute paths are
 * allowed (blocks open-redirects like `//evil.com` or `https://...`).
 */
const getSafeNextPath = (
    value: string | null | undefined,
    fallback = "/",
): string => {
    if (!value) return fallback;
    try {
        const decoded = decodeURIComponent(value);
        if (
            decoded.startsWith("/") &&
            !decoded.startsWith("//") &&
            !decoded.includes("\\")
        ) {
            return decoded;
        }
    } catch {
        /* invalid encoding -> fallback */
    }
    return fallback;
};

/** Sign-in URL preserving where to return afterwards. */
const signInHref = (next?: string | null): string => {
    return next ? `/signin?next=${encodeURIComponent(next)}` : "/signin";
};

export {
    formatSlug,
    joinSlugCategory,
    renderImage,
    markdownToHtml,
    isPostAuthor,
    getSafeNextPath,
    signInHref,
};

