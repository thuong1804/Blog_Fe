// HTML sanitizing + markdown helpers.
//
// IMPORTANT: this module must stay server-safe. We use plain `dompurify`
// (zero dependencies) and only call it in the browser. `isomorphic-dompurify`
// is banned here: on the server it instantiates jsdom at import time, and
// jsdom's transitive deps (whatwg-url/html-encoding-sniffer, pinned to
// ESM-only majors via package.json overrides) crash Vercel serverless
// functions with "Error: require() of ES Module ...". SSR uses a
// conservative regex fallback below.

import DOMPurify from "dompurify";

type PurifyLike = {
    sanitize: (dirty: string, config?: Record<string, unknown>) => string;
};

const MAIN_CONFIG = {
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
};

const COMMENT_TAGS = [
    "b",
    "i",
    "em",
    "strong",
    "u",
    "ul",
    "ol",
    "li",
    "blockquote",
    "p",
    "br",
];

function getPurify(): PurifyLike | null {
    // Server (incl. SSR prerender of client components): no window.
    // Importing dompurify on the server is harmless (no jsdom involved);
    // it just must never be *called* without a window.
    if (typeof window === "undefined") return null;
    return DOMPurify as unknown as PurifyLike;
}

const DANGEROUS_TAGS =
    "script|style|iframe|object|embed|form|input|button|meta|link|base|noscript|template|svg|math|video|audio|source|track|canvas|dialog|slot|select|textarea|option";

/** Conservative SSR fallback: strip dangerous elements, event handlers and
 *  javascript:/data: URLs. Benign markup (headings, paragraphs, links,
 *  images, code) passes through unchanged so SSR output matches the client. */
function serverSanitize(dirty: string, allowedTags?: string[]): string {
    let out = String(dirty ?? "");
    // Drop dangerous elements together with their content.
    out = out.replace(
        new RegExp(
            `<(${DANGEROUS_TAGS})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`,
            "gi",
        ),
        "",
    );
    // Drop any stray dangerous tags.
    out = out.replace(
        new RegExp(`<\\/?(${DANGEROUS_TAGS})\\b[^>]*>`, "gi"),
        "",
    );
    // Strip event-handler attributes (onclick, onerror, ...).
    out = out.replace(
        /\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s"'`>]+)/g,
        "",
    );
    // Neutralize javascript:/data:/vbscript: URLs.
    out = out.replace(
        /\s(href|src|xlink:href)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi,
        (m, attr, _q, d1, d2, d3) => {
            const url = String(d1 ?? d2 ?? d3 ?? "").trim();
            if (/^(javascript|data|vbscript):/i.test(url)) return ` ${attr}="#"`;
            return m;
        },
    );
    if (allowedTags && allowedTags.length > 0) {
        // Comment allowlist: keep only listed tags, drop every attribute.
        const allow = new Set(allowedTags.map((t) => t.toLowerCase()));
        out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (m, tag) => {
            if (!allow.has(String(tag).toLowerCase())) return "";
            if (m.startsWith("</")) return `</${String(tag).toLowerCase()}>`;
            // Self-closing <br/> style tags keep their shape without attrs.
            if (/\/>$/.test(m)) return `<${String(tag).toLowerCase()} />`;
            return `<${String(tag).toLowerCase()}>`;
        });
    }
    return out;
}

const sanitizeHtml = (dirty: string): string => {
    const purify = getPurify();
    if (purify) return purify.sanitize(dirty, MAIN_CONFIG);
    return serverSanitize(dirty);
};

/** Comment allowlist variant (backend already allowlists; defense in depth). */
const sanitizeCommentHtml = (dirty: string): string => {
    const purify = getPurify();
    if (purify) {
        return purify.sanitize(dirty, {
            ALLOWED_TAGS: COMMENT_TAGS,
            ALLOWED_ATTR: [],
        });
    }
    return serverSanitize(dirty, COMMENT_TAGS);
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

export { sanitizeHtml, sanitizeCommentHtml, markdownToHtml };
