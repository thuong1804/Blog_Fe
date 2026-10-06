import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    staticPageGenerationTimeout: 300,
    // Don't leak the framework version in the `X-Powered-By` header.
    poweredByHeader: false,
    experimental: {
        workerThreads: false,
        cpus: 1
    } ,
    images: {
        // HTTPS only: plain-HTTP images enable mixed-content attacks.
        // Add your trusted hosts here instead of a wildcard when possible.
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    // Clickjacking defense. Use DENY if the site is never iframed.
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    // Stop browsers from MIME-sniffing responses into scripts.
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    // Limit referrer leakage to other sites.
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    // Lock down powerful browser features the blog doesn't use.
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), payment=()",
                    },
                    // Force HTTPS for a year (browsers remember per-domain).
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
