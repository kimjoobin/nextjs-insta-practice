/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8280',
        pathname: '/images/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
};

export default nextConfig;
