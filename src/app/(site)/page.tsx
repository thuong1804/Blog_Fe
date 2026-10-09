import type { Metadata } from "next";
import LandingPage from "@/containers/LandingPage/LandingPageContainer";
import JsonLd from "@/components/Seo/JsonLd";

// ISR for the landing page (the `revalidate` inside LandingPageContainer is
// ignored — Next only reads it from page/layout/route files).
export const revalidate = 300;

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default function Home() {
    const SITE = (
        process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000"
    ).replace(/\/$/, "");
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "TECHNEWS",
                    url: SITE,
                    description:
                        "Explore articles on programming, Next.js, React, Node.js, and web development best practices.",
                }}
            />
            <LandingPage />
        </>
    );
}
