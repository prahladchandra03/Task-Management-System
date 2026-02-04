/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Agar request '/api/...' par aaye
        destination: 'http://localhost:5000/api/:path*', // Toh use Port 5000 par bhej do
      },
    ];
  },
};

export default nextConfig;