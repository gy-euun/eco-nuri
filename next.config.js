/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // scripts 디렉토리 제외
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
  // TypeScript 빌드에서 제외
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
