import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dcassetcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yourspex.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.fittingbox.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.lenskart.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig;
