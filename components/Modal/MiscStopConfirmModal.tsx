'use client';

import {useTimerStore} from '@/store/useTimerStore';
import Modal from './Modal';
import {formatDuration} from '@/utils/timeFormat';

export default function MiscStopConfirmModal() {
  const {
    showMiscStopModal,
    closeMiscStopModal,
    confirmMiscStop,
    isRunning,
    isPaused,
    startTime,
    pausedTime,
    currentActivity,
    isMiscRunning,
    miscStartTime,
  } = useTimerStore();

  const hasActivity = (isRunning || isPaused) && startTime;
  const hasMisc = isMiscRunning && miscStartTime;

  let activityDuration = 0;
  if (hasActivity) {
    if (isRunning) {
      activityDuration =
        pausedTime + (new Date().getTime() - startTime!.getTime());
    } else {
      activityDuration = pausedTime;
    }
  }

  let miscDuration = 0;
  if (hasMisc) {
    miscDuration = new Date().getTime() - miscStartTime!.getTime();
  }

  const handleConfirm = () => {
    confirmMiscStop();
  };

  return (
    <Modal isOpen={showMiscStopModal} onClose={closeMiscStopModal}>
      <div className='p-6 pb-4 border-b border-slate-100'>
        <h3 className='m-0 text-xl font-semibold text-gray-800'>
          잡동사니 종료
        </h3>
      </div>
      <div className='p-6'>
        <p className='m-0 mb-4 text-gray-500 text-[0.95rem]'>
          잡동사니를 종료하면 아래 시간들이 모두 기록됩니다.
        </p>

        <div className='space-y-3'>
          {hasActivity && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
              <div className='text-blue-700 text-sm mb-1'>진행 중인 활동</div>
              <div className='flex justify-between items-center'>
                <strong className='text-blue-900 text-base'>
                  {currentActivity}
                </strong>
                <span className='text-blue-700 font-semibold'>
                  {formatDuration(activityDuration)}
                </span>
              </div>
            </div>
          )}

          {hasMisc && (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
              <div className='text-gray-700 text-sm mb-1'>
                진행 중인 잡동사니
              </div>
              <div className='flex justify-between items-center'>
                <strong className='text-gray-900 text-base'>잡동사니</strong>
                <span className='text-gray-700 font-semibold'>
                  {formatDuration(miscDuration)}
                </span>
              </div>
            </div>
          )}

          {!hasActivity && !hasMisc && (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 text-center text-gray-500'>
              기록할 시간이 없습니다
            </div>
          )}
        </div>

        <div className='mt-4 text-sm text-gray-500'>
          종료 후 잡동사니 모드가 해제됩니다.
        </div>
      </div>
      <div className='p-4 px-6 pb-6 flex gap-3 justify-end'>
        <button
          onClick={closeMiscStopModal}
          className='px-8 py-3.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:bg-gray-200'>
          취소
        </button>
        <button
          onClick={handleConfirm}
          className='px-8 py-3.5 bg-red-600 text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:-translate-y-0.5 hover:shadow-lg hover:bg-red-700'>
          종료
        </button>
      </div>
    </Modal>
  );
}
