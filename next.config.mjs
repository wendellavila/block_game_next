/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/projects/block_game_next' : undefined;

const nextConfig = {
    basePath: basePath,
    trailingSlash: true,
    output: 'export',
    images: {
        unoptimized: true
    }
}

export default nextConfig;
