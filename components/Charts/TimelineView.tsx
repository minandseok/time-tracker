'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {
  formatTime,
  formatDuration,
  formatDurationNatural,
} from '@/utils/timeFormat';
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
        활동별 시간 흐름
      </h3>

      {/* Time info */}
      <div className='flex items-center gap-4 text-sm flex-wrap mb-4'>
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
      </div>

      {/* Timeline boxes by time (chronological) */}
      <div className='border border-gray-200 rounded-lg p-3 sm:p-6 bg-white overflow-x-auto'>
        <div className='flex gap-2 flex-wrap'>
          {timelineData.records.map((recordData, recordIndex) => {
            const isSelected = selectedActivity === recordData.activity;
            const isDimmed = selectedActivity && !isSelected;

            return (
              <div
                key={recordIndex}
                className={`inline-flex items-center justify-center px-3 py-2 rounded transition-all duration-200 min-w-fit ${
                  isSelected
                    ? 'ring-2 ring-blue-400 ring-offset-2'
                    : isDimmed
                    ? 'opacity-30'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: recordData.color,
                  color: '#ffffff',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedActivity(
                    selectedActivity === recordData.activity
                      ? null
                      : recordData.activity
                  );
                }}>
                <span className='text-sm font-medium whitespace-nowrap'>
                  {formatDurationNatural(recordData.duration)}
                </span>
              </div>
            );
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
