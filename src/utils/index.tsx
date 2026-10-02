import Image from "next/image";

const formatSlug = (slug: string): string => {
    return slug.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
};

const joinSlugCategory = (
    parent: string | undefined,
    children: string | undefined,
    slug: string,
) => {
    return `/${formatSlug(parent || "")}/${formatSlug(children || "")}/${slug}`;
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
        return md;
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

    return html;
};

export { formatSlug, joinSlugCategory, renderImage, markdownToHtml };

