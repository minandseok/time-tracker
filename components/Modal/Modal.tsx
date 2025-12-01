'use client';

import {useEffect, ReactNode} from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({isOpen, onClose, children}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/50 flex items-start justify-center z-1000 backdrop-blur-sm p-4 pt-[15vh]'
      onClick={handleOverlayClick}>
      <div className='bg-white rounded-2xl p-0 max-w-[400px] w-[90%] max-h-[90vh] shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-modal-appear'>
        {children}
      </div>
    </div>
  );
}
