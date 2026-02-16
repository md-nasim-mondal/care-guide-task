import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  initialContent?: string;
  title: string;
}

export const PostModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialContent = "",
  title,
}: PostModalProps) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await onSubmit(content);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
          <Dialog.Title className='text-lg font-bold mb-4'>
            {title}
          </Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <textarea
                className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-37.5'
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className='flex justify-end gap-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition'
                disabled={loading}>
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50'
                disabled={loading || !content.trim()}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
