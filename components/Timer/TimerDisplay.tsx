'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {formatDuration} from '@/utils/timeFormat';
import {useEffect, useState} from 'react';

export default function TimerDisplay() {
  const {isRunning, startTime, pausedTime} = useTimerStore();
  const [displayTime, setDisplayTime] = useState('00:00:00');

  useEffect(() => {
    if (!isRunning) {
      if (pausedTime > 0) {
        setDisplayTime(formatDuration(pausedTime));
      } else {
        setDisplayTime('00:00:00');
      }
      return;
    }

    const updateDisplay = () => {
      if (startTime) {
        const currentElapsed = new Date().getTime() - startTime.getTime();
        const totalElapsed = pausedTime + currentElapsed;
        setDisplayTime(formatDuration(totalElapsed));
      }
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, pausedTime]);

  return (
    <div className='text-center my-8'>
      <div className='text-[3.5rem] font-light text-gray-800 mb-2 tracking-tighter tabular-nums'>
        {displayTime}
      </div>
    </div>
  );
}
