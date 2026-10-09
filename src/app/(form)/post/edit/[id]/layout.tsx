import type { Metadata } from "next";

// Auth-gated form pages must never appear in search results.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function LayoutForm({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#080D1A] via-[#0F172A] to-[#1E293B]">
            {children}
        </div>
    );
}
