/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: { },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, '.');
    return config;
  },
};

module.exports = nextConfig;