'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {formatDuration, formatTime} from '@/utils/timeFormat';
import {useState} from 'react';
import RecordsList from './RecordsList';

export default function RecordsSection() {
  const {records, openClearAllModal} = useTimerStore();
  const [copied, setCopied] = useState(false);

  const copyTableToClipboard = async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard) {
      alert('복사 기능을 사용할 수 없습니다.');
      return;
    }

    try {
      const markdownTable = [
        '| 번호 | 활동 이름 | 시간 범위 | 걸린 시간 |',
        '|------|-------------|----------|----------|',
        ...records.map((record, index) => {
          const timeRange = `${formatTime(record.startTime)} - ${formatTime(
            record.endTime
          )}`;
          return `| ${index + 1} | ${
            record.activity
          } | ${timeRange} | ${formatDuration(record.duration)} |`;
        }),
      ].join('\n');

      await navigator.clipboard.writeText(markdownTable);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold text-gray-800'>기록</h2>

        <div className='flex gap-2'>
          <button
            onClick={copyTableToClipboard}
            disabled={records.length === 0}
            className={`text-white text-sm px-4 py-2 rounded-lg border-none cursor-pointer transition-all duration-300 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
              copied
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg hover:enabled:bg-blue-700'
            }`}
            title='표 복사'>
            {copied ? '✓ 복사됨' : '📋 복사'}
          </button>
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
