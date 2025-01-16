/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    distDir: 'out',

    images: {
        domains: ['localhost'], // Add the hostname here
    },
};

export default nextConfig;
