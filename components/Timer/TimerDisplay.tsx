'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {formatDuration} from '@/utils/timeFormat';
import {useEffect, useState} from 'react';

export default function TimerDisplay() {
  const {isRunning, isPaused, startTime, pausedTime} = useTimerStore();
  const [displayTime, setDisplayTime] = useState('00:00:00');

  useEffect(() => {
    if (!isRunning) return;

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

  // Display time for stopped/paused state
  const staticDisplayTime =
    isPaused && pausedTime > 0 ? formatDuration(pausedTime) : '00:00:00';

  const finalDisplayTime = isRunning ? displayTime : staticDisplayTime;

  return (
    <div className='text-center my-8'>
      <div className='text-[3.5rem] font-light text-gray-800 mb-2 tracking-tighter tabular-nums'>
        {finalDisplayTime}
      </div>
    </div>
  );
}
