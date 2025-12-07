'use client';

import {useEffect} from 'react';
import {useTimerStore} from '@/store/useTimerStore';
import Header from './Header';
import TimerSection from './Timer/TimerSection';
import RecordsSection from './Records/RecordsSection';
import ChartsView from './Charts/ChartsView';
import DeleteModal from './Modal/DeleteModal';
import ClearAllModal from './Modal/ClearAllModal';
import SwitchActivityModal from './Modal/SwitchActivityModal';
import MiscStopConfirmModal from './Modal/MiscStopConfirmModal';

export default function TimeTrackerApp() {
  const loadRecordsFromStorage = useTimerStore(
    (state) => state.loadRecordsFromStorage
  );

  useEffect(() => {
    loadRecordsFromStorage();
  }, [loadRecordsFromStorage]);

  return (
    <div className='max-w-[1400px] mx-auto p-8'>
      <Header />

      {/* 타이머와 기록 */}
      <div className='grid grid-cols-1 gap-6 mb-6'>
        <TimerSection />
        <section className='bg-white rounded-[20px] p-10 shadow-lg border border-gray-100 h-[450px] flex flex-col'>
          <RecordsSection />
        </section>
      </div>

      {/* 시각화 섹션 */}
      <div className='grid grid-cols-1 gap-6'>
        {/* 타임라인 뷰 */}
        <section className='bg-white rounded-[20px] p-10 shadow-lg border border-gray-100'>
          <ChartsView type='timeline' />
        </section>

        {/* 통계 그래프 */}
        <section className='bg-white rounded-[20px] p-10 shadow-lg border border-gray-100'>
          <ChartsView type='stats' />
        </section>
      </div>

      <DeleteModal />
      <ClearAllModal />
      <SwitchActivityModal />
      <MiscStopConfirmModal />
    </div>
  );
}
