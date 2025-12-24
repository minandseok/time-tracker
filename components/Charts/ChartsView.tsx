'use client';

import TimelineView from './TimelineView';

interface ChartsViewProps {
  type: 'timeline' | 'stats';
}

export default function ChartsView({type}: ChartsViewProps) {
  if (type === 'timeline') {
    return <TimelineView />;
  }

  return null;
}
