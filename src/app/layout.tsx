import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";
import "./globals.css";
import ApolloWrapper from "@/lib/ApolloWrapper";
import ToastProvider from "@/context/ToastProvider/ToastProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext/AuthContext";
import ProgressProviders from "@/context/ProgressProvider/ProgressProvider";
import HydrationScrubber from "@/components/HydrationScrubber/HydrationScrubber";
import Script from "next/script";

const raleway = Raleway({
    subsets: ["latin"],
    variable: "--font-raleway",
    weight: ["400", "700"],
});

const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-roboto",
    weight: ["400", "700"],
});
export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000",
    ),
    icons: {
        icon: "/global.svg",
    },
    title: {
        default: "TECHNEWS",
        // Page-level `generateMetadata` returns a plain string title and
        template: "%s | TECHNEWS",
    },
    description:
        "Explore articles on programming, Next.js, React, Node.js, and web development best practices. Stay updated with the latest tech trends for developers.",
    openGraph: {
        type: "website",
        siteName: "TECHNEWS",
        locale: "en_US",
        title: "TECHNEWS",
        description:
            "Explore articles on programming, Next.js, React, Node.js, and web development best practices.",
    },
    twitter: {
        card: "summary_large_image",
        title: "TECHNEWS",
        description:
            "Explore articles on programming, Next.js, React, Node.js, and web development best practices.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${raleway.variable} ${roboto.variable} antialiased`}
                suppressHydrationWarning={true}
            >
                <Script
                    src="https://accounts.google.com/gsi/client"
                    strategy="afterInteractive"
                />
                <ApolloWrapper>
                    <GoogleOAuthProvider
                        clientId={
                            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string
                        }
                    >
                        <ToastProvider>
                            <AuthProvider>
                                <ProgressProviders>
                                    <HydrationScrubber />
                                    {children}
                                </ProgressProviders>
                            </AuthProvider>
                        </ToastProvider>
                    </GoogleOAuthProvider>
                </ApolloWrapper>
            </body>
        </html>
    );
}
