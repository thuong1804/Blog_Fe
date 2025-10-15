import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

export default nextConfig;
