'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {formatTime, formatDuration} from '@/utils/timeFormat';
import {getActivityColor} from '@/utils/colorUtils';
import {useMemo, useState} from 'react';

export default function TimelineView() {
  const {records} = useTimerStore();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const timelineData = useMemo(() => {
    if (records.length === 0) return null;

    // Sort records by start time (chronological order)
    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // Calculate overall timeline info
    const firstStartTime = sortedRecords[0].startTime;
    const lastEndTime = sortedRecords[sortedRecords.length - 1].endTime;
    const totalDuration = sortedRecords.reduce(
      (sum, record) => sum + record.duration,
      0
    );

    return {
      records: sortedRecords.map((record) => ({
        activity: record.activity,
        duration: record.duration,
        totalSeconds: Math.floor(record.duration / 1000),
        startTime: record.startTime,
        endTime: record.endTime,
        color: getActivityColor(record.activity),
      })),
      firstStartTime,
      lastEndTime,
      totalDuration,
    };
  }, [records]);

  if (!timelineData || timelineData.records.length === 0) {
    return (
      <div className='flex items-center justify-center h-40 text-gray-400 italic'>
        기록이 없습니다
      </div>
    );
  }

  // Cell settings
  const CELLS_PER_ROW = 60; // Show 60 cells per row (1 minute)
  const gap = 3;

  // Get unique activities for legend
  const uniqueActivities = Array.from(
    new Map(
      timelineData.records.map((record) => [
        record.activity,
        {activity: record.activity, color: record.color},
      ])
    ).values()
  );

  return (
    <div className='flex flex-col' onClick={() => setSelectedActivity(null)}>
      {/* Title */}
      <h3 className='text-lg font-semibold text-gray-800 mb-3'>
        시간 흐름 타임라인
      </h3>

      {/* Block saturation legend + Time info */}
      <div className='flex items-center justify-between mb-4'>
        {/* Block saturation legend (left) */}
        <div className='flex items-center gap-3 text-xs'>
          <span className='text-gray-500 font-semibold'>블록 채도:</span>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 bg-gray-900 rounded'
                style={{opacity: 1.0}}
              />
              <span className='text-gray-600'>1시간</span>
            </div>
            <span className='text-gray-300'>·</span>
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 bg-gray-900 rounded'
                style={{opacity: 0.9}}
              />
              <span className='text-gray-600'>30분</span>
            </div>
            <span className='text-gray-300'>·</span>
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 bg-gray-900 rounded'
                style={{opacity: 0.8}}
              />
              <span className='text-gray-600'>15분</span>
            </div>
            <span className='text-gray-300'>·</span>
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 bg-gray-900 rounded'
                style={{opacity: 0.7}}
              />
              <span className='text-gray-600'>1분</span>
            </div>
            <span className='text-gray-300'>·</span>
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 bg-gray-900 rounded'
                style={{opacity: 0.5}}
              />
              <span className='text-gray-600'>30초</span>
            </div>
            <span className='text-gray-300'>·</span>
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 bg-gray-900 rounded'
                style={{opacity: 0.4}}
              />
              <span className='text-gray-600'>15초</span>
            </div>
            <span className='text-gray-300'>·</span>
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 bg-gray-900 rounded'
                style={{opacity: 0.2}}
              />
              <span className='text-gray-600'>1초</span>
            </div>
          </div>
        </div>

        {/* Time info (right) */}
        <div className='flex items-center gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>시작 시간:</span>
            <span className='font-semibold text-blue-600'>
              {formatTime(timelineData.firstStartTime)}
            </span>
          </div>
          <span className='text-gray-300'>→</span>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>종료 시간:</span>
            <span className='font-semibold text-purple-600'>
              {formatTime(timelineData.lastEndTime)}
            </span>
          </div>
          <span className='text-gray-300'>|</span>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>전체 시간:</span>
            <span className='font-bold text-emerald-600'>
              {formatDuration(timelineData.totalDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline grid by time (chronological) */}
      <div className='border border-gray-200 rounded-lg p-6 bg-white'>
        <div
          className='grid'
          style={{
            gridTemplateColumns: `repeat(${CELLS_PER_ROW}, 1fr)`,
            gap: `${gap}px`,
          }}>
          {timelineData.records.map((recordData, recordIndex) => {
            const cells = [];
            let remainingSeconds = recordData.totalSeconds;
            let cellKey = 0;

            // Check if this record is selected or dimmed
            const isSelected = selectedActivity === recordData.activity;
            const isDimmed = selectedActivity && !isSelected;

            // 1. Create 1-hour blocks first
            const hours = Math.floor(remainingSeconds / 3600);
            for (let i = 0; i < hours; i++) {
              cells.push(
                <div
                  key={`${recordIndex}-hour-${cellKey++}`}
                  className='relative group rounded transition-all duration-200'
                  style={{
                    backgroundColor: recordData.color,
                    opacity: isDimmed ? 0.2 : 1,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(59, 130, 246, 0.8)'
                      : 'none',
                    aspectRatio: '1 / 1',
                  }}>
                  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none'>
                    <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded whitespace-nowrap text-center'>
                      {recordData.activity}: 1시간
                      <br />
                      {formatTime(recordData.startTime)} -{' '}
                      {formatTime(recordData.endTime)}
                    </div>
                  </div>
                </div>
              );
            }
            remainingSeconds -= hours * 3600;

            // 2. Create 30-minute blocks
            const thirtyMins = Math.floor(remainingSeconds / 1800);
            for (let i = 0; i < thirtyMins; i++) {
              cells.push(
                <div
                  key={`${recordIndex}-30min-${cellKey++}`}
                  className='relative group rounded transition-all duration-200'
                  style={{
                    backgroundColor: recordData.color,
                    opacity: isDimmed ? 0.2 : 0.9,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(59, 130, 246, 0.8)'
                      : 'none',
                    aspectRatio: '1 / 1',
                  }}>
                  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none'>
                    <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded whitespace-nowrap text-center'>
                      {recordData.activity}: 30분
                      <br />
                      {formatTime(recordData.startTime)} -{' '}
                      {formatTime(recordData.endTime)}
                    </div>
                  </div>
                </div>
              );
            }
            remainingSeconds -= thirtyMins * 1800;

            // 3. Create 15-minute blocks
            const fifteenMins = Math.floor(remainingSeconds / 900);
            for (let i = 0; i < fifteenMins; i++) {
              cells.push(
                <div
                  key={`${recordIndex}-15min-${cellKey++}`}
                  className='relative group rounded transition-all duration-200'
                  style={{
                    backgroundColor: recordData.color,
                    opacity: isDimmed ? 0.2 : 0.8,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(59, 130, 246, 0.8)'
                      : 'none',
                    aspectRatio: '1 / 1',
                  }}>
                  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none'>
                    <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded whitespace-nowrap text-center'>
                      {recordData.activity}: 15분
                      <br />
                      {formatTime(recordData.startTime)} -{' '}
                      {formatTime(recordData.endTime)}
                    </div>
                  </div>
                </div>
              );
            }
            remainingSeconds -= fifteenMins * 900;

            // 4. Create 1-minute blocks
            const minutes = Math.floor(remainingSeconds / 60);
            for (let i = 0; i < minutes; i++) {
              cells.push(
                <div
                  key={`${recordIndex}-min-${cellKey++}`}
                  className='relative group rounded transition-all duration-200'
                  style={{
                    backgroundColor: recordData.color,
                    opacity: isDimmed ? 0.2 : 0.7,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(59, 130, 246, 0.8)'
                      : 'none',
                    aspectRatio: '1 / 1',
                  }}>
                  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none'>
                    <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded whitespace-nowrap text-center'>
                      {recordData.activity}: 1분
                      <br />
                      {formatTime(recordData.startTime)} -{' '}
                      {formatTime(recordData.endTime)}
                    </div>
                  </div>
                </div>
              );
            }
            remainingSeconds -= minutes * 60;

            // 5. Create 30-second blocks
            const thirtySeconds = Math.floor(remainingSeconds / 30);
            for (let i = 0; i < thirtySeconds; i++) {
              cells.push(
                <div
                  key={`${recordIndex}-30sec-${cellKey++}`}
                  className='relative group rounded transition-all duration-200'
                  style={{
                    backgroundColor: recordData.color,
                    opacity: isDimmed ? 0.2 : 0.5,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(59, 130, 246, 0.8)'
                      : 'none',
                    aspectRatio: '1 / 1',
                  }}>
                  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none'>
                    <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded whitespace-nowrap text-center'>
                      {recordData.activity}: 30초
                      <br />
                      {formatTime(recordData.startTime)} -{' '}
                      {formatTime(recordData.endTime)}
                    </div>
                  </div>
                </div>
              );
            }
            remainingSeconds -= thirtySeconds * 30;

            // 6. Create 15-second blocks
            const fifteenSeconds = Math.floor(remainingSeconds / 15);
            for (let i = 0; i < fifteenSeconds; i++) {
              cells.push(
                <div
                  key={`${recordIndex}-15sec-${cellKey++}`}
                  className='relative group rounded transition-all duration-200'
                  style={{
                    backgroundColor: recordData.color,
                    opacity: isDimmed ? 0.2 : 0.4,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(59, 130, 246, 0.8)'
                      : 'none',
                    aspectRatio: '1 / 1',
                  }}>
                  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none'>
                    <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded whitespace-nowrap text-center'>
                      {recordData.activity}: 15초
                      <br />
                      {formatTime(recordData.startTime)} -{' '}
                      {formatTime(recordData.endTime)}
                    </div>
                  </div>
                </div>
              );
            }
            remainingSeconds -= fifteenSeconds * 15;

            // 7. Create 1-second blocks for remaining seconds
            for (let i = 0; i < remainingSeconds; i++) {
              cells.push(
                <div
                  key={`${recordIndex}-sec-${cellKey++}`}
                  className='relative group rounded transition-all duration-200'
                  style={{
                    backgroundColor: recordData.color,
                    opacity: isDimmed ? 0.2 : 0.2,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(59, 130, 246, 0.8)'
                      : 'none',
                    aspectRatio: '1 / 1',
                  }}>
                  <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none'>
                    <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded whitespace-nowrap text-center'>
                      {recordData.activity}: 1초
                      <br />
                      {formatTime(recordData.startTime)} -{' '}
                      {formatTime(recordData.endTime)}
                    </div>
                  </div>
                </div>
              );
            }

            return cells;
          })}
        </div>
      </div>

      {/* Activity legend (outside, below timeline grid) */}
      <div className='mt-4'>
        <div className='flex flex-wrap gap-3 items-center'>
          <span className='text-sm font-semibold text-gray-600 mr-2'>
            활동:
          </span>
          {uniqueActivities.map((item) => (
            <div
              key={item.activity}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedActivity(
                  selectedActivity === item.activity ? null : item.activity
                );
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedActivity === item.activity
                  ? 'bg-blue-100 border-blue-400 shadow-md scale-105'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
              <div
                className='w-3 h-3 rounded-full'
                style={{backgroundColor: item.color}}
              />
              <span className='font-medium text-gray-700 text-sm'>
                {item.activity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
