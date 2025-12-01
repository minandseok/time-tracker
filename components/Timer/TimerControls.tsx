'use client';

import {useTimerStore} from '@/store/useTimerStore';

export default function TimerControls() {
  const {
    isRunning,
    isPaused,
    currentActivity,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useTimerStore();

  const handleStart = () => {
    if (currentActivity.trim()) {
      startTimer(currentActivity);
    }
  };

  const getButtonBaseClass = () =>
    'px-8 py-3.5 border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';

  return (
    <div className='flex gap-4 justify-center'>
      {!isRunning && !isPaused && (
        <button
          onClick={handleStart}
          disabled={!currentActivity.trim()}
          className={`${getButtonBaseClass()} bg-green-600 text-white hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg hover:enabled:bg-green-700`}>
          시작
        </button>
      )}

      {isRunning && (
        <button
          onClick={pauseTimer}
          className={`${getButtonBaseClass()} bg-amber-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:bg-amber-700`}>
          일시정지
        </button>
      )}

      {isPaused && (
        <>
          <button
            onClick={resumeTimer}
            className={`${getButtonBaseClass()} bg-blue-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-700`}>
            재개
          </button>
          <button
            onClick={stopTimer}
            className={`${getButtonBaseClass()} bg-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:bg-indigo-700`}>
            기록
          </button>
        </>
      )}
    </div>
  );
}
