import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/allocations',
        destination: '/subscriptions',
        permanent: true,
      },
      // Docs page still uses the old design — hidden until it's restyled to
      // match the rest of the site. Temporary, so not a permanent redirect.
      {
        source: '/docs',
        destination: '/',
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

export default nextConfig;
