'use client';

import {TimeRecord} from '@/types';
import {formatDuration, formatTime, formatDate} from '@/utils/timeFormat';
import {useState} from 'react';

interface RecordItemProps {
  record: TimeRecord;
  onDelete: (id: number) => void;
}

export default function RecordItem({record, onDelete}: RecordItemProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    if (window.innerWidth <= 640) {
      setIsActive(!isActive);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(record.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white border rounded-xl p-5 mb-4 border-l-4 transition-all duration-300 relative hover:shadow-sm hover:translate-x-1 group ${
        isActive
          ? 'border-l-blue-500 bg-blue-50 border-blue-200'
          : 'border-l-indigo-400 border-gray-200'
      }`}>
      <div className='flex justify-between items-center mb-2'>
        <div className='flex-1 flex justify-between items-center'>
          <div
            className={`font-semibold text-lg ${
              isActive ? 'text-blue-700' : 'text-gray-800'
            }`}>
            {record.activity}
          </div>
          <div className='font-medium text-indigo-600 text-lg'>
            {formatDuration(record.duration)}
          </div>
        </div>
        <button
          onClick={handleDeleteClick}
          className={`bg-red-500 text-white border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer text-sm transition-all duration-200 ml-3 hover:bg-red-600 hover:scale-110 md:opacity-0 md:scale-75 md:group-hover:opacity-100 md:group-hover:scale-100 ${
            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          title='삭제'>
          ×
        </button>
      </div>
      <div className='text-sm text-gray-500 flex gap-4 max-[640px]:flex-col max-[640px]:gap-1'>
        <span>
          {formatDate(record.startTime)} {formatTime(record.startTime)} -{' '}
          {formatTime(record.endTime)}
        </span>
      </div>
    </div>
  );
}
