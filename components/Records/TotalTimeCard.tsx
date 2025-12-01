'use client';

import {formatDuration} from '@/utils/timeFormat';
import {TimeRecord} from '@/types';

interface TotalTimeCardProps {
  records: TimeRecord[];
}

export default function TotalTimeCard({records}: TotalTimeCardProps) {
  const totalTime = records.reduce((sum, record) => sum + record.duration, 0);
  const recordCount = records.length;

  return (
    <div className='bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 text-center shadow-md'>
      <div className='text-sm text-gray-600 mb-2 font-medium'>총 기록 시간</div>
      <div className='text-[2.2rem] font-bold mb-2 tabular-nums text-blue-600'>
        {formatDuration(totalTime)}
      </div>
      <div className='text-[0.85rem] text-gray-500 font-normal'>
        {recordCount}개의 프로젝트 기록
      </div>
    </div>
  );
}
