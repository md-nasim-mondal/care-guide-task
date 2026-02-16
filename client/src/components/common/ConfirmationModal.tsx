import type { FC } from "react";
import { Modal } from "./Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  confirmButtonClassName?: string;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmButtonClassName = "bg-red-600 hover:bg-red-700 text-white",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className='space-y-4'>
        <div className='text-gray-600'>{message}</div>
        <div className='flex gap-3 justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium'>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md transition text-sm font-medium ${confirmButtonClassName}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
