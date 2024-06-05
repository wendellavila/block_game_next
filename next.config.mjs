/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? process.env.NEXT_PUBLIC_BASE_PATH : undefined;

const nextConfig = {
    basePath: basePath,
    trailingSlash: true,
    output: 'export',
    images: {
        unoptimized: true
    }
}

export default nextConfig;
