import TimeTrackerApp from '@/components/TimeTrackerApp';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Time Tracker',
    applicationCategory: 'ProductivityApplication',
    description: '간단하고 효율적인 프로젝트 시간 추적 및 관리 도구',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '1',
    },
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <TimeTrackerApp />
    </>
  );
}
