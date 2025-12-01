import {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Time Tracker - 프로젝트 시간 관리',
    short_name: 'Time Tracker',
    description: '간단하고 효율적인 시간 추적 도구',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f7fa',
    theme_color: '#667eea',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

