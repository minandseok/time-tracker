'use client';

import {useTimerStore} from '@/store/useTimerStore';
import Modal from './Modal';

export default function ClearAllModal() {
  const {showClearAllModal, closeClearAllModal, clearAllRecords} =
    useTimerStore();

  const handleConfirm = () => {
    clearAllRecords();
  };

  return (
    <Modal isOpen={showClearAllModal} onClose={closeClearAllModal}>
      <div className='p-6 pb-4 border-b border-slate-100'>
        <h3 className='m-0 text-xl font-semibold text-gray-800'>
          전체 기록 초기화
        </h3>
      </div>
      <div className='p-6'>
        <p className='m-0 mb-4 text-gray-500 text-[0.95rem]'>
          모든 기록을 삭제하시겠습니까?
        </p>
        <div className='bg-amber-50 border border-amber-300 rounded-lg p-3 text-center text-amber-900 text-sm'>
          ⚠️ 이 작업은 되돌릴 수 없습니다.
        </div>
      </div>
      <div className='p-4 px-6 pb-6 flex gap-3 justify-end max-[480px]:flex-col-reverse'>
        <button
          onClick={closeClearAllModal}
          className='px-8 py-3.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:bg-gray-200 max-[480px]:w-full max-[480px]:max-w-none'>
          취소
        </button>
        <button
          onClick={handleConfirm}
          className='px-8 py-3.5 bg-red-600 text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:-translate-y-0.5 hover:shadow-lg hover:bg-red-700 max-[480px]:w-full max-[480px]:max-w-none'>
          모두 삭제
        </button>
      </div>
    </Modal>
  );
}
