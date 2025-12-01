import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Time Tracker - 프로젝트 시간 관리 도구',
  description:
    '간단하고 효율적인 시간 추적 도구. 프로젝트별 시간을 기록하고, 마크다운 표로 내보내며, 생산성을 높이세요. 무료 온라인 타이머.',
  keywords: [
    '시간 추적',
    'time tracker',
    '타이머',
    '프로젝트 관리',
    '시간 관리',
    '생산성 도구',
    '업무 시간 기록',
    'pomodoro',
    '시간 기록',
    '작업 시간',
  ],
  authors: [{name: 'Time Tracker'}],
  creator: 'Time Tracker',
  publisher: 'Time Tracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://time-tracker.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Time Tracker - 프로젝트 시간 관리 도구',
    description:
      '간단하고 효율적인 시간 추적 도구. 프로젝트별 시간을 기록하고 생산성을 높이세요.',
    url: 'https://time-tracker.vercel.app',
    siteName: 'Time Tracker',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Time Tracker - 프로젝트 시간 관리',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Tracker - 프로젝트 시간 관리 도구',
    description:
      '간단하고 효율적인 시간 추적 도구. 프로젝트별 시간을 기록하고 생산성을 높이세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // 나중에 Google Search Console에서 받은 코드로 교체
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
