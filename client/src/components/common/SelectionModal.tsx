import { type FC } from "react";
import { Modal } from "./Modal";

interface Option {
  label: string;
  value: string | number;
}

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: Option[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
}

export const SelectionModal: FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className='flex flex-col gap-2'>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
            className={`w-full text-left px-4 py-3 rounded-md transition font-medium ${
              selectedValue === option.value
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}>
            {option.label}
          </button>
        ))}
      </div>
    </Modal>
  );
};
