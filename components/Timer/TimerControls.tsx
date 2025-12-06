'use client';

import {useTimerStore} from '@/store/useTimerStore';

export default function TimerControls() {
  const {
    isRunning,
    isPaused,
    miscEnabled,
    currentActivity,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    openSwitchModal,
  } = useTimerStore();

  const handleStart = () => {
    if (currentActivity.trim()) {
      startTimer(currentActivity);
    }
  };

  const getButtonBaseClass = () =>
    'px-8 py-3.5 border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';

  return (
    <div className='flex gap-4 justify-center flex-wrap'>
      {/* 대기 중 */}
      {!isRunning && !isPaused && (
        <button
          onClick={handleStart}
          disabled={!currentActivity.trim() || !miscEnabled}
          className={`${getButtonBaseClass()} bg-green-600 text-white hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg hover:enabled:bg-green-700`}>
          시작
        </button>
      )}

      {/* 집중 활동 실행 중 */}
      {isRunning && !isPaused && (
        <>
          <button
            onClick={openSwitchModal}
            disabled={!miscEnabled}
            className={`${getButtonBaseClass()} bg-purple-600 text-white hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg hover:enabled:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}>
            전환
          </button>
          <button
            onClick={pauseTimer}
            className={`${getButtonBaseClass()} bg-amber-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:bg-amber-700`}>
            일시정지
          </button>
          <button
            onClick={stopTimer}
            className={`${getButtonBaseClass()} bg-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:bg-indigo-700`}>
            기록
          </button>
        </>
      )}

      {/* 일시정지 중 */}
      {isPaused && (
        <button
          onClick={resumeTimer}
          className={`${getButtonBaseClass()} bg-blue-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-700`}>
          재개
        </button>
      )}
    </div>
  );
}
