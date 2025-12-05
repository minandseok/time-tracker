'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {useState, useEffect} from 'react';
import {formatDuration} from '@/utils/timeFormat';
import ActivityInput from './ActivityInput';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';

export default function TimerSection() {
  const {isMiscRunning, miscStartTime, miscEnabled, startMiscActivity} =
    useTimerStore();
  const [miscDisplayTime, setMiscDisplayTime] = useState('00:00:00');

  useEffect(() => {
    if (!isMiscRunning || !miscStartTime) return;

    const updateDisplay = () => {
      const elapsed = new Date().getTime() - miscStartTime.getTime();
      setMiscDisplayTime(formatDuration(elapsed));
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);
    return () => clearInterval(interval);
  }, [isMiscRunning, miscStartTime]);

  const finalMiscDisplayTime =
    isMiscRunning && miscStartTime ? miscDisplayTime : '00:00:00';

  return (
    <section className='bg-white rounded-[20px] p-10 shadow-lg border border-gray-100 h-[450px] flex flex-col justify-center'>
      {/* 잡동사니 버튼 + 타이머 (활동 입력칸 위) */}
      <div className='flex items-center justify-between gap-3 mb-4 min-h-[32px]'>
        <div className='flex-1'>
          {!miscEnabled && (
            <div className='text-xs text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-md border border-yellow-200 inline-block'>
              💡 잡동사니를 먼저 시작해야 활동을 기록할 수 있습니다
            </div>
          )}
          {isMiscRunning && (
            <div className='text-sm font-semibold text-gray-700 tabular-nums'>
              {finalMiscDisplayTime}
            </div>
          )}
        </div>

        <button
          onClick={startMiscActivity}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shrink-0 ${
            miscEnabled
              ? 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400'
              : 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg'
          }`}>
          {miscEnabled ? '잡동사니 종료' : '잡동사니 시작'}
        </button>
      </div>

      <ActivityInput />
      <TimerDisplay />
      <TimerControls />
    </section>
  );
}
