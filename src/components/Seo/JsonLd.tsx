// Minimal JSON-LD renderer for SEO structured data (Article,
// BreadcrumbList, WebSite). Rendered server-side so crawlers see it in HTML.

export default function JsonLd({
    data,
}: {
    data: Record<string, unknown> | Record<string, unknown>[];
}) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function toIsoDate(value?: string | null): string | undefined {
    if (!value) return undefined;
    const numeric = Number(value);
    const date = Number.isFinite(numeric) ? new Date(numeric) : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
