import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
    ],
  },
}

export default nextConfig;
