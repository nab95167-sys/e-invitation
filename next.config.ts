import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/**': ['./prisma/**'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/raksmey/index.html',
      },
      {
        source: '/invite/:slug*',
        destination: '/raksmey/index.html',
      },
      {
        source: '/raksmey',
        destination: '/raksmey/index.html',
      },
    ];
  },
};

export default nextConfig;
