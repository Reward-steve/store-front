import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "img.freepik.com" },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 30, // seconds a dynamic page is served from client cache before refetching
    },
  },
};

export default nextConfig;
