// Pure auth/navigation helpers — no DOM/Node dependencies, safe to import
// from any Server Component, Route Handler, or client component.

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

export type { IdentityLike };
export { isPostAuthor, getSafeNextPath, signInHref };
