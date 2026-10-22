const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? '/Divya-Vani' : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  trailingSlash: true,
};

export default nextConfig;
