/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ❌ Disable ESLint completely during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
