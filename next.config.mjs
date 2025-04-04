/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Bỏ qua lỗi TypeScript khi build (không khuyến khích dùng lâu dài)
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
