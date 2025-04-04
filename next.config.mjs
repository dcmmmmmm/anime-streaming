/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "093ya7ld4f.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      }
    ]
  }
};

export default nextConfig;
