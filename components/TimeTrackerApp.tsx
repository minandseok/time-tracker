'use client';

import {useEffect} from 'react';
import {useTimerStore} from '@/store/useTimerStore';
import Header from './Header';
import TimerSection from './Timer/TimerSection';
import RecordsSection from './Records/RecordsSection';
import DeleteModal from './Modal/DeleteModal';
import ClearAllModal from './Modal/ClearAllModal';
import ManualAddModal from './Modal/ManualAddModal';
import SwitchActivityModal from './Modal/SwitchActivityModal';

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
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <section className='bg-white rounded-[20px] p-10 shadow-lg border border-gray-100 h-[450px] flex flex-col justify-center'>
          <TimerSection />
        </section>
        <section className='bg-white rounded-[20px] p-10 shadow-lg border border-gray-100 h-[450px] flex flex-col'>
          <RecordsSection />
        </section>
      </div>
      <DeleteModal />
      <ClearAllModal />
      <ManualAddModal />
      <SwitchActivityModal />
    </div>
  );
}
