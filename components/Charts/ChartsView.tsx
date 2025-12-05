'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {formatDuration} from '@/utils/timeFormat';
import {getActivityColor} from '@/utils/colorUtils';
import {calculateActivityStats, calculateTimeStats} from '@/utils/statistics';
import TimelineView from './TimelineView';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

// Custom tooltip component (defined outside render)
interface TooltipPayload {
  payload: {
    name: string;
    value: number;
    count?: number;
    durationMs?: number;
    timeInSeconds?: number;
  };
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({active, payload}: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    // Use durationMs if available, otherwise use value
    const durationMs =
      data.payload.durationMs || data.payload.value || data.value || 0;
    return (
      <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
        <p className='font-semibold text-gray-800'>{data.payload.name}</p>
        <p className='text-sm text-blue-600'>
          시간: {formatDuration(durationMs)}
        </p>
        {data.payload.count && (
          <p className='text-sm text-gray-600'>기록: {data.payload.count}개</p>
        )}
      </div>
    );
  }
  return null;
};

interface ChartsViewProps {
  type: 'timeline' | 'stats';
}

export default function ChartsView({type}: ChartsViewProps) {
  const {records} = useTimerStore();

  if (type === 'timeline') {
    return <TimelineView />;
  }

  if (records.length === 0) {
    return (
      <div className='flex items-center justify-center h-40 text-gray-400 italic'>
        기록이 없습니다
      </div>
    );
  }

  // Calculate activity statistics using utility function
  const activityStats = calculateActivityStats(records);
  const {totalTime} = calculateTimeStats(records);

  // Bar chart data (convert time to seconds)
  const barData = activityStats.map((item) => ({
    name: item.name,
    timeInSeconds: Math.floor(item.duration / 1000), // in seconds
    durationMs: item.duration, // original time (milliseconds)
    count: item.count,
  }));

  return (
    <div className='flex flex-col'>
      {/* Header with title and activity count */}
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>
          활동별 시간 분포
        </h3>
        <div className='flex items-center gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>총 활동 수:</span>
            <span className='font-bold text-blue-600'>
              {activityStats.length}개
            </span>
          </div>
          <span className='text-gray-300'>|</span>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>전체 시간:</span>
            <span className='font-bold text-purple-600 tabular-nums'>
              {formatDuration(totalTime)}
            </span>
          </div>
        </div>
      </div>

      {/* 바 차트 - 활동별 시간 */}
      <div className='bg-white border border-gray-200 rounded-xl p-6'>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            data={barData}
            margin={{top: 30, right: 20, left: 0, bottom: 5}}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey='name' tick={{fontSize: 14}} angle={0} height={70} />
            <YAxis
              tick={{fontSize: 12}}
              tickFormatter={(value) => `${Math.floor(value / 60)}분`}
              ticks={Array.from(
                {
                  length:
                    Math.floor(
                      Math.max(...barData.map((d) => d.timeInSeconds)) / 60
                    ) + 1,
                },
                (_, i) => i * 60
              )}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='timeInSeconds' radius={[8, 8, 0, 0]}>
              {barData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={getActivityColor(entry.name)}
                />
              ))}
              <LabelList
                dataKey='durationMs'
                position='top'
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={(props: any) => {
                  const {x, y, width, value} = props;
                  const numX = typeof x === 'number' ? x : parseFloat(x || '0');
                  const numY = typeof y === 'number' ? y : parseFloat(y || '0');
                  const numWidth =
                    typeof width === 'number'
                      ? width
                      : parseFloat(width || '0');
                  const numValue =
                    typeof value === 'number'
                      ? value
                      : parseFloat(value || '0');

                  if (numValue > 0) {
                    return (
                      <text
                        x={numX + numWidth / 2}
                        y={numY - 5}
                        fill='#6b7280'
                        fontSize={11}
                        fontWeight={600}
                        textAnchor='middle'>
                        {formatDuration(numValue)}
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity list */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {activityStats.map((stat) => {
          const color = getActivityColor(stat.name);
          return (
            <div
              key={stat.name}
              className='bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200'>
              <div className='flex items-center gap-3 mb-2'>
                <div
                  className='w-4 h-4 rounded-full shrink-0'
                  style={{backgroundColor: color}}
                />
                <h4 className='font-semibold text-gray-800 truncate flex-1'>
                  {stat.name}
                </h4>
              </div>
              <div className='space-y-1.5 ml-7'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>시간</span>
                  <span className='text-sm font-semibold text-gray-800 tabular-nums'>
                    {formatDuration(stat.duration)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>기록 수</span>
                  <span className='text-sm font-semibold text-gray-800'>
                    {stat.count}개
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>비율</span>
                  <span className='text-sm font-semibold text-indigo-600'>
                    {stat.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
