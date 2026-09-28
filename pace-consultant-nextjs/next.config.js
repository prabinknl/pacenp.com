/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.paceconsultant.com.np',
      },
    ],
  },
  webpack: (config) => {
    // Disable Webpack caching to prevent OneDrive file-locking conflicts on Windows
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
