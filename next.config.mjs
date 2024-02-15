// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kasmregistry.linuxserver.io",
        port: "",
        pathname: "/1.0/icons/**",
      },
      {
        protocol: "https",
        hostname: "registry.kasmweb.com",
        port: "",
        pathname: "/1.0/icons/**",
      },
    ],
  },
};

export default nextConfig;
