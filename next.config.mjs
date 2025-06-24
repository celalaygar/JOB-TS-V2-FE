/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ✅ Strict Mode kapatılıyor

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
