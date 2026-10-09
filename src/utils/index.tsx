// Barrel kept for compatibility — every module re-exported here must stay
// free of top-level Node/browser-only imports (no isomorphic-dompurify,
// no jsdom) so Server Components can safely import from "@/utils".
// Prefer importing from the direct module path (@/utils/slug,
// @/utils/guards, @/utils/render, @/utils/sanitize) in new code.

export { formatSlug, joinSlugCategory } from "./slug";
export { isPostAuthor, getSafeNextPath, signInHref } from "./guards";
export type { IdentityLike } from "./guards";
export { renderImage } from "./render";
export { sanitizeHtml, sanitizeCommentHtml, markdownToHtml } from "./sanitize";
