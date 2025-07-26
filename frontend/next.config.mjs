/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. API Rewrites - Proxy API calls to avoid CORS issues
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://your-backend-api.vercel.app/api/:path*',
            },
        ];
    },

    // 2. Custom headers for better cookie handling
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'https://your-backend-api.vercel.app',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,POST,PUT,DELETE,OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization, Cookie',
                    },
                ],
            },
        ];
    },

    // 3. Environment variables for API URL
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-api.vercel.app',
    }
};

export default nextConfig;
