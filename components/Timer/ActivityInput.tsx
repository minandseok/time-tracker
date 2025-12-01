'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {KeyboardEvent} from 'react';

export default function ActivityInput() {
  const {currentActivity, setCurrentActivity, startTimer, isRunning, isPaused} =
    useTimerStore();

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      !isRunning &&
      !isPaused &&
      currentActivity.trim()
    ) {
      startTimer(currentActivity);
    }
  };

  return (
    <div className='mb-8'>
      <input
        type='text'
        value={currentActivity}
        onChange={(e) => setCurrentActivity(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isRunning || isPaused}
        placeholder='프로젝트 이름 (예: 공부, 운동, 독서)'
        className='w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-base font-normal bg-white transition-all duration-300 outline-none focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(96,165,250,0.1)] disabled:opacity-50 disabled:cursor-not-allowed'
      />
    </div>
  );
}
