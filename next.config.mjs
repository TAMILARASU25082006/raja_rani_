/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Allows flexible audio context and socket lifecycle
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
};

export default nextConfig;
