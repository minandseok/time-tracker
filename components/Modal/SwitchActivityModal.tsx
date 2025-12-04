'use client';

import {useTimerStore} from '@/store/useTimerStore';
import Modal from './Modal';
import {useState} from 'react';

export default function SwitchActivityModal() {
  const {showSwitchModal, closeSwitchModal, switchActivity, currentActivity} =
    useTimerStore();

  const [newActivity, setNewActivity] = useState('');
  const [error, setError] = useState('');

  const handleSwitch = () => {
    if (!newActivity.trim()) {
      setError('새 프로젝트 이름을 입력해주세요.');
      return;
    }

    switchActivity(newActivity.trim());
    setNewActivity('');
    setError('');
    closeSwitchModal();
  };

  const handleClose = () => {
    setNewActivity('');
    setError('');
    closeSwitchModal();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newActivity.trim()) {
      handleSwitch();
    }
  };

  return (
    <Modal isOpen={showSwitchModal} onClose={handleClose}>
      <div className='p-6 pb-4 border-b border-slate-100'>
        <h3 className='m-0 text-xl font-semibold text-gray-800'>활동 전환</h3>
      </div>
      <div className='p-6'>
        <div className='space-y-4'>
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm'>
              {error}
            </div>
          )}

          <div className='bg-blue-50 border-2 border-blue-200 rounded-lg p-4'>
            <div className='text-sm text-gray-600 mb-1'>현재 활동</div>
            <div className='text-lg font-bold text-blue-700'>
              {currentActivity}
            </div>
            <div className='text-xs text-gray-500 mt-2'>
              → 이 활동은 자동으로 기록됩니다
            </div>
          </div>

          <div className='flex items-center justify-center text-2xl text-gray-400'>
            ↓
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              새 프로젝트 이름
            </label>
            <input
              type='text'
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='예: 회의, 문서 작성, 코딩'
              autoFocus
              className='w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg'
            />
          </div>

          <div className='bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700'>
            ✨ 새 활동의 타이머가 즉시 시작됩니다
          </div>
        </div>
      </div>
      <div className='p-4 px-6 pb-6 flex gap-3 justify-end'>
        <button
          onClick={handleClose}
          className='px-8 py-3.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:bg-gray-200'>
          취소
        </button>
        <button
          onClick={handleSwitch}
          disabled={!newActivity.trim()}
          className='px-8 py-3.5 bg-green-600 text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:-translate-y-0.5 hover:shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'>
          전환하기
        </button>
      </div>
    </Modal>
  );
}
