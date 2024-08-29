import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, '.');
    return config;
  },
};

export default nextConfig;
