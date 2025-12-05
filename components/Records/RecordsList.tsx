'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {formatDuration, formatTime} from '@/utils/timeFormat';
import {getActivityColor} from '@/utils/colorUtils';
import {calculateTimeStats} from '@/utils/statistics';

export default function RecordsList() {
  const {records, openDeleteModal} = useTimerStore();

  if (records.length === 0) {
    return (
      <div className='text-center text-gray-400 italic py-8'>
        아직 기록이 없습니다
      </div>
    );
  }

  // Calculate time statistics using utility function
  const {totalTime, totalCount, miscTime, miscCount, focusTime, focusCount} =
    calculateTimeStats(records);

  return (
    <div className='flex flex-col h-full'>
      {/* Time statistics */}
      <div className='mb-4 shrink-0'>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <span className='text-gray-500'>전체 시간:</span>
            <span className='font-bold text-blue-600 tabular-nums'>
              {formatDuration(totalTime)}
            </span>
            <span className='text-xs text-gray-400'>({totalCount}개)</span>
          </div>
          <span className='text-gray-300 hidden sm:inline'>|</span>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <span className='text-gray-500'>집중 시간:</span>
            <span className='font-bold text-purple-600 tabular-nums'>
              {formatDuration(focusTime)}
            </span>
            <span className='text-xs text-gray-400'>({focusCount}개)</span>
          </div>
          <span className='text-gray-300 hidden sm:inline'>|</span>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <span className='text-gray-500'>잡동사니 시간:</span>
            <span className='font-bold text-gray-600 tabular-nums'>
              {formatDuration(miscTime)}
            </span>
            <span className='text-xs text-gray-400'>({miscCount}개)</span>
          </div>
        </div>
      </div>
      <div className='flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded'>
        <table className='w-full border-collapse'>
          <thead className='sticky top-0 z-10'>
            <tr className='bg-linear-to-r from-slate-50 to-gray-50 border-b border-gray-200 shadow-sm'>
              <th className='text-center px-3 py-2.5 font-semibold text-[10px] uppercase tracking-wide text-gray-600 w-16'>
                번호
              </th>
              <th className='text-left px-3 py-2.5 font-semibold text-[10px] uppercase tracking-wide text-gray-600'>
                활동 이름
              </th>
              <th className='text-left px-3 py-2.5 font-semibold text-[10px] uppercase tracking-wide text-gray-600'>
                시간 범위
              </th>
              <th className='text-right px-3 py-2.5 font-semibold text-[10px] uppercase tracking-wide text-gray-600'>
                걸린 시간
              </th>
              <th className='w-16'></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id}
                className='border-b border-gray-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group'>
                <td className='px-3 py-3 text-center'>
                  <span className='inline-flex items-center justify-center w-7 h-7 rounded-lg bg-linear-to-br from-slate-100 to-gray-100 text-xs font-bold text-gray-700 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-700 transition-all duration-200'>
                    {index + 1}
                  </span>
                </td>
                <td className='px-3 py-3'>
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white shadow-sm'
                      style={{
                        backgroundColor: getActivityColor(record.activity),
                      }}
                    />
                    <span className='font-semibold text-sm text-gray-800 group-hover:text-gray-900'>
                      {record.activity}
                    </span>
                  </div>
                </td>
                <td className='px-3 py-3'>
                  <div className='flex items-center gap-1.5 text-xs text-gray-600'>
                    <svg
                      className='w-3.5 h-3.5 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <span className='tabular-nums'>
                      {formatTime(record.startTime)} -{' '}
                      {formatTime(record.endTime)}
                    </span>
                  </div>
                </td>
                <td className='px-3 py-3 text-right'>
                  <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-xs font-bold text-indigo-700 tabular-nums group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-200'>
                    <svg
                      className='w-3 h-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
                    {formatDuration(record.duration)}
                  </span>
                </td>
                <td className='px-3 py-3'>
                  <button
                    onClick={() => openDeleteModal(record.id)}
                    className='w-7 h-7 rounded-lg bg-red-50 text-red-500 border border-red-200 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100'
                    title='삭제'>
                    <svg
                      className='w-3.5 h-3.5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
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
