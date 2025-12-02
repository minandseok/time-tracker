'use client';

import {useState} from 'react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

export default function TimePicker({value, onChange, label}: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectingHour, setSelectingHour] = useState(true);

  const getCurrentTime = () => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      return {hour: h, minute: m};
    }
    return {hour: 12, minute: 0};
  };

  const {hour: currentHour, minute: currentMinute} = getCurrentTime();
  const [hour, setHour] = useState(currentHour);
  const [minute, setMinute] = useState(currentMinute);

  const handleHourSelect = (h: number) => {
    setHour(h);
    setSelectingHour(false);
  };

  const handleMinuteSelect = (m: number) => {
    setMinute(m);
    const timeString = `${hour.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}`;
    onChange(timeString);
    setShowPicker(false);
    setSelectingHour(true);
  };

  const hours = Array.from({length: 24}, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const getClockPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90;
    const radius = 90;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return {x: x + 110, y: y + 110};
  };

  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>
      <div className='relative'>
        <input
          type='text'
          value={value}
          onClick={() => setShowPicker(true)}
          readOnly
          placeholder='시간 선택'
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'
        />

        {showPicker && (
          <div className='absolute top-full mt-2 left-0 right-0 bg-white border-2 border-blue-500 rounded-xl shadow-2xl p-6 z-50'>
            <div className='text-center mb-4'>
              <div className='text-3xl font-bold text-gray-800'>
                {hour.toString().padStart(2, '0')}:
                {minute.toString().padStart(2, '0')}
              </div>
              <div className='text-sm text-gray-500 mt-1'>
                {selectingHour ? '시간을 선택하세요' : '분을 선택하세요'}
              </div>
            </div>

            {selectingHour ? (
              <div className='relative w-[220px] h-[220px] mx-auto'>
                <svg
                  className='absolute inset-0'
                  width='220'
                  height='220'
                  viewBox='0 0 220 220'>
                  <circle
                    cx='110'
                    cy='110'
                    r='100'
                    fill='#f0f9ff'
                    stroke='#3b82f6'
                    strokeWidth='2'
                  />
                  {hours.map((h, index) => {
                    const pos = getClockPosition(index, 24);
                    const isSelected = h === hour;
                    return (
                      <g key={h}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r='16'
                          fill={isSelected ? '#3b82f6' : 'white'}
                          stroke='#3b82f6'
                          strokeWidth='1'
                          className='cursor-pointer hover:fill-blue-100 transition-colors'
                          onClick={() => handleHourSelect(h)}
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor='middle'
                          dominantBaseline='middle'
                          fill={isSelected ? 'white' : '#3b82f6'}
                          fontSize='12'
                          fontWeight='600'
                          className='pointer-events-none select-none'>
                          {h}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className='grid grid-cols-4 gap-2'>
                {minutes.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMinuteSelect(m)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      m === minute
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}>
                    {m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            )}

            <div className='flex gap-2 mt-4'>
              {!selectingHour && (
                <button
                  onClick={() => setSelectingHour(true)}
                  className='flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors'>
                  ← 뒤로
                </button>
              )}
              <button
                onClick={() => {
                  setShowPicker(false);
                  setSelectingHour(true);
                }}
                className='flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors'>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
