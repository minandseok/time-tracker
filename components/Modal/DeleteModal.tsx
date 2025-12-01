'use client';

import {useTimerStore} from '@/store/useTimerStore';
import Modal from './Modal';
import {formatDuration} from '@/utils/timeFormat';

export default function DeleteModal() {
  const {
    showDeleteModal,
    recordToDelete,
    records,
    closeDeleteModal,
    deleteRecord,
  } = useTimerStore();

  const record = records.find((r) => r.id === recordToDelete);

  if (!record) return null;

  const handleConfirm = () => {
    deleteRecord(record.id);
  };

  return (
    <Modal isOpen={showDeleteModal} onClose={closeDeleteModal}>
      <div className='p-6 pb-4 border-b border-slate-100'>
        <h3 className='m-0 text-xl font-semibold text-gray-800'>기록 삭제</h3>
      </div>
      <div className='p-6'>
        <p className='m-0 mb-4 text-gray-500 text-[0.95rem]'>
          이 기록을 정말 삭제하시겠습니까?
        </p>
        <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-center'>
          <strong className='block text-red-600 text-lg mb-1'>
            {record.activity}
          </strong>
          <span className='text-red-900 text-sm'>
            {formatDuration(record.duration)}
          </span>
        </div>
      </div>
      <div className='p-4 px-6 pb-6 flex gap-3 justify-end'>
        <button
          onClick={closeDeleteModal}
          className='px-8 py-3.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:bg-gray-200'>
          취소
        </button>
        <button
          onClick={handleConfirm}
          className='px-8 py-3.5 bg-red-600 text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 min-w-[120px] outline-none hover:-translate-y-0.5 hover:shadow-lg hover:bg-red-700'>
          삭제
        </button>
      </div>
    </Modal>
  );
}
