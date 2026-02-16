import type { FC, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm transition-opacity'
      onClick={onClose}>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden animate-fade-in-up'
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {title || "Modal"}
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 focus:outline-none transition-colors'
            aria-label='Close'>
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
