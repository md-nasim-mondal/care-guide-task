import type { FC } from "react";
import { Modal } from "../common/Modal";

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  submitLabel?: string;
}

export const NoteModal: FC<NoteModalProps> = ({
  isOpen,
  onClose,
  note,
  onSubmit,
  title,
  submitLabel,
}) => {
  const modalTitle = title || (note ? "Edit Note" : "Create New Note");
  const buttonLabel = submitLabel || (note ? "Update Note" : "Create Note");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Title
          </label>
          <input
            type='text'
            name='title'
            defaultValue={note?.title}
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
            placeholder='Enter note title'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Content
          </label>
          <textarea
            name='content'
            rows={5}
            defaultValue={note?.content}
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
            placeholder='Write your note content here...'></textarea>
        </div>
        <div className='flex gap-3 pt-2'>
          <button
            type='submit'
            className='flex-1 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            {buttonLabel}
          </button>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
