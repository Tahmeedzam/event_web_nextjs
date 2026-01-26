import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Replace with your image host
        pathname: '/images/**', // Optional: restrict to specific paths
      },
    ],
  }
};

export default nextConfig;
