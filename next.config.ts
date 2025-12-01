import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  poweredByHeader: false,

  // 성능 최적화
  reactStrictMode: true,

  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
