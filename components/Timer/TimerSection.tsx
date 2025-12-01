'use client';

import ActivityInput from './ActivityInput';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';

export default function TimerSection() {
  return (
    <div>
      <ActivityInput />
      <TimerDisplay />
      <TimerControls />
    </div>
  );
}
