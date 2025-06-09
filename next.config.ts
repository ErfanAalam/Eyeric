import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    ],
},
}

export default nextConfig;
