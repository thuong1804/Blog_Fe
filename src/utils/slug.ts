import { GENERAL_CATEGORY_SLUG } from "@/constant";

// Pure slug helpers — no DOM/Node dependencies, safe to import from any
// Server Component, Route Handler, or Middleware. Keep this module free of
// browser/Node-only imports (no DOMPurify/jsdom): it is bundled into every
// page via the header/landing components, and jsdom crashes Vercel
// serverless functions with "require() of ES Module".

const formatSlug = (slug: string): string => {
    return slug.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
};

const joinSlugCategory = (
    parent: string | undefined,
    children: string | undefined,
    slug: string,
) => {
    return `/${formatSlug(parent || GENERAL_CATEGORY_SLUG)}/${formatSlug(children || "")}/${slug}`;
};

export { formatSlug, joinSlugCategory };
