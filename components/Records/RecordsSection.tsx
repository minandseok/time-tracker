'use client';

import {useTimerStore} from '@/store/useTimerStore';
import RecordsList from './RecordsList';

export default function RecordsSection() {
  const {records, openClearAllModal} = useTimerStore();

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold text-gray-800'>기록</h2>

        <div className='flex gap-2'>
          <button
            onClick={openClearAllModal}
            disabled={records.length === 0}
            className='bg-orange-600 text-white text-sm px-4 py-2 rounded-lg min-w-0 border-none cursor-pointer transition-all duration-300 hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg hover:enabled:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed'
            title='모든 기록 삭제'>
            전체 초기화
          </button>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        <RecordsList />
      </div>
    </div>
  );
}
