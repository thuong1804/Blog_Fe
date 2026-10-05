import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    staticPageGenerationTimeout: 300,
    experimental: {
        workerThreads: false,
        cpus: 1
    } ,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
};

export default nextConfig;
