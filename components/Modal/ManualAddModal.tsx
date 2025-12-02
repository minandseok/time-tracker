'use client';

import {useTimerStore} from '@/store/useTimerStore';
import Modal from './Modal';
import TimePicker from './TimePicker';
import {useState} from 'react';

export default function ManualAddModal() {
  const {showManualAddModal, closeManualAddModal, addManualRecord} =
    useTimerStore();

  const [projectName, setProjectName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const getDateInfo = () => {
    if (!startTime || !endTime) return null;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startValue = startHour * 60 + startMinute;
    const endValue = endHour * 60 + endMinute;

    const isNextDay = endValue <= startValue;

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      });
    };

    return {
      startDate: formatDate(today),
      endDate: formatDate(isNextDay ? tomorrow : today),
      isNextDay,
    };
  };

  const dateInfo = getDateInfo();

  const handleSubmit = () => {
    // 유효성 검사
    if (!projectName.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }

    if (!startTime || !endTime) {
      setError('시작 시간과 종료 시간을 모두 입력해주세요.');
      return;
    }

    const start = new Date();
    const [startHour, startMinute] = startTime.split(':');
    start.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    const end = new Date();
    const [endHour, endMinute] = endTime.split(':');
    end.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

    // 종료 시간이 시작 시간보다 빠르면 다음날로 처리
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const duration = end.getTime() - start.getTime();

    if (duration <= 0) {
      setError('종료 시간이 시작 시간보다 늦어야 합니다.');
      return;
    }

    // 기록 추가
    addManualRecord(projectName.trim(), start, end, duration);

    // 초기화 및 닫기
    setProjectName('');
    setStartTime('');
    setEndTime('');
    setError('');
    closeManualAddModal();
  };

  const handleClose = () => {
    setProjectName('');
    setStartTime('');
    setEndTime('');
    setError('');
    closeManualAddModal();
  };

  return (
    <Modal isOpen={showManualAddModal} onClose={handleClose}>
      <div className='p-6 pb-4 border-b border-slate-100'>
        <h3 className='m-0 text-xl font-semibold text-gray-800'>
          수동으로 시간 추가
        </h3>
      </div>
      <div className='p-6'>
        <div className='space-y-4'>
          {dateInfo && (
            <div className='bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-2'>
              <div className='flex items-center justify-between text-sm'>
                <div className='flex-1'>
                  <div className='text-xs text-gray-500 mb-1'>시작</div>
                  <div className='font-bold text-blue-700'>
                    {dateInfo.startDate}
                  </div>
                  <div className='text-lg font-mono text-blue-900 mt-1'>
                    {startTime}
                  </div>
                </div>
                <div className='mx-4 text-2xl text-blue-400'>→</div>
                <div className='flex-1 text-right'>
                  <div className='text-xs text-gray-500 mb-1'>종료</div>
                  <div
                    className={`font-bold ${
                      dateInfo.isNextDay ? 'text-orange-700' : 'text-blue-700'
                    }`}>
                    {dateInfo.endDate}
                    {dateInfo.isNextDay && (
                      <span className='ml-1 text-xs bg-orange-100 px-2 py-0.5 rounded'>
                        다음날
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-lg font-mono mt-1 ${
                      dateInfo.isNextDay ? 'text-orange-900' : 'text-blue-900'
                    }`}>
                    {endTime}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm'>
              {error}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              프로젝트 이름
            </label>
            <input
              type='text'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder='예: 공부, 운동, 독서'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <TimePicker
            value={startTime}
            onChange={setStartTime}
            label='시작 시간'
          />

          <TimePicker value={endTime} onChange={setEndTime} label='종료 시간' />

          {!dateInfo && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700'>
              💡 종료 시간이 시작 시간보다 빠르면 자동으로 다음날로 처리됩니다.
            </div>
          )}
        </div>
      </div>
      <div className='p-4 px-6 pb-6 flex gap-3 justify-end'>
        <button
          onClick={handleClose}
          className='px-8 py-3.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:bg-gray-200'>
          취소
        </button>
        <button
          onClick={handleSubmit}
          className='px-8 py-3.5 bg-blue-600 text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-700'>
          추가
        </button>
      </div>
    </Modal>
  );
}
