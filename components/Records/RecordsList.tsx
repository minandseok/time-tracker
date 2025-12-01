'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {formatDuration, formatTime} from '@/utils/timeFormat';

export default function RecordsList() {
  const {records, openDeleteModal} = useTimerStore();

  const copyTableToClipboard = () => {
    const markdownTable = [
      '| 번호 | 프로젝트 이름 | 시간 범위 | 걸린 시간 |',
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

    navigator.clipboard.writeText(markdownTable);
  };

  if (records.length === 0) {
    return (
      <div className='text-center text-gray-400 italic py-8'>
        아직 기록이 없습니다
      </div>
    );
  }

  const totalTime = records.reduce((sum, record) => sum + record.duration, 0);

  return (
    <div className='flex flex-col h-full'>
      <div className='mb-4 flex justify-between items-center flex-shrink-0'>
        <div className='text-sm text-gray-600'>
          총{' '}
          <span className='font-bold text-blue-600'>
            {formatDuration(totalTime)}
          </span>{' '}
          ({records.length}개)
        </div>
        <button
          onClick={copyTableToClipboard}
          className='bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-700'
          title='표 복사'>
          📋 복사
        </button>
      </div>
      <div className='flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded'>
        <table className='w-full border-collapse'>
          <thead className='sticky top-0 z-10'>
            <tr className='bg-blue-50 border-b-2 border-blue-200'>
              <th className='text-center p-3 font-semibold text-gray-700 w-16'>
                번호
              </th>
              <th className='text-left p-3 font-semibold text-gray-700'>
                프로젝트 이름
              </th>
              <th className='text-left p-3 font-semibold text-gray-700'>
                시간 범위
              </th>
              <th className='text-right p-3 font-semibold text-gray-700'>
                걸린 시간
              </th>
              <th className='w-10'></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id}
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                <td className='p-3 text-center text-gray-500 font-medium'>
                  {index + 1}
                </td>
                <td className='p-3 font-medium text-gray-800'>
                  {record.activity}
                </td>
                <td className='p-3 text-sm text-gray-600'>
                  {formatTime(record.startTime)} - {formatTime(record.endTime)}
                </td>
                <td className='p-3 text-right font-medium text-indigo-600'>
                  {formatDuration(record.duration)}
                </td>
                <td className='p-3'>
                  <button
                    onClick={() => openDeleteModal(record.id)}
                    className='bg-red-500 text-white border-none rounded w-6 h-6 flex items-center justify-center cursor-pointer text-sm transition-all duration-200 hover:bg-red-600 hover:scale-110'
                    title='삭제'>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
