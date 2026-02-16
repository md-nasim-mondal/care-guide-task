import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../api/api";
import { toast } from "react-hot-toast";
import { Pagination } from "../common/Pagination";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { NoteModal } from "../notes/NoteModal";
import { SelectionModal } from "../common/SelectionModal";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
}

export const NotesManagement = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [noteInputValue, setNoteInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const params: any = {
        sortField: "createdAt",
        sortOrder: "desc",
        page,
        limit,
      };
      if (searchTerm) params.searchTerm = searchTerm;

      const res = await api.get("/notes/all-notes", { params });
      setAllNotes(res?.data?.data);
      if (res?.data?.meta) {
        setTotalPages(res?.data?.meta?.totalPage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notes");
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchTerm]);

  const handleNoteSearch = () => {
    setSearchTerm(noteInputValue);
    setPage(1);
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNoteSearch();
    }
  };

  const handleDeleteNoteClick = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await api.delete(`/notes/${noteToDelete}`);
      toast.success("Note deleted");
      fetchNotes();
      setNoteToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  const openNoteModal = (note?: Note) => {
    setEditingNote(note || null);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setEditingNote(null);
    setIsNoteModalOpen(false);
  };

  const handleUpdateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingNote) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await api.patch(`/notes/${editingNote?._id}`, data);
      toast.success("Note updated");
      closeNoteModal();
      fetchNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    }
  };

  const limitOptions = [
    { label: "5 per page", value: 5 },
    { label: "10 per page", value: 10 },
    { label: "20 per page", value: 20 },
    { label: "50 per page", value: 50 },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row flex-wrap justify-between items-center gap-4'>
        <h2 className='text-xl font-semibold'>All Notes Management</h2>
        <div className='flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto items-center'>
          <div className='flex gap-2 w-full md:w-auto'>
            <input
              type='text'
              placeholder='Search by title...'
              value={noteInputValue}
              onChange={(e) => setNoteInputValue(e.target.value)}
              onKeyDown={handleNoteKeyDown}
              className='p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64'
            />
            <button
              onClick={handleNoteSearch}
              className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm whitespace-nowrap'>
              Search
            </button>
          </div>
          <button
            onClick={() => setIsLimitModalOpen(true)}
            className='p-2 border rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto text-left min-w-30'>
            {limit} per page
          </button>
        </div>
      </div>

      <div className='overflow-x-auto rounded-lg shadow-sm border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200 hidden md:table'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Content
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Author
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {allNotes.map((n) => (
              <tr key={n._id}>
                <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-900'>
                  {n?.title}
                </td>
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-500'>
                    <div className='line-clamp-2 max-w-xs mb-1'>
                      {n?.content}
                    </div>
                    <Link
                      to={`/notes/${n?._id}`}
                      className='text-indigo-600 hover:text-indigo-800 text-xs font-medium hover:underline'>
                      See more
                    </Link>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {n?.author?.name}
                  <br />
                  <span className='text-xs text-gray-400'>
                    {n?.author?.email}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <button
                    onClick={() => openNoteModal(n)}
                    className='text-indigo-600 hover:text-indigo-900 mr-4'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNoteClick(n?._id)}
                    className='text-red-600 hover:text-red-900'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='md:hidden space-y-4 p-4 bg-gray-50'>
          {allNotes.map((n) => (
            <div
              key={n._id}
              className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
              <div className='mb-2'>
                <h3 className='font-bold text-gray-900 mb-1'>{n?.title}</h3>
                <p className='text-xs text-gray-500'>
                  By {n?.author?.name} ({n?.author?.email})
                </p>
              </div>
              <p className='text-sm text-gray-600 line-clamp-3 mb-3'>
                {n?.content}
              </p>
              <div className='flex justify-end gap-3'>
                <button
                  onClick={() => openNoteModal(n)}
                  className='text-sm font-medium text-indigo-600 hover:text-indigo-800'>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNoteClick(n?._id)}
                  className='text-sm font-medium text-red-600 hover:text-red-800'>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {allNotes.length === 0 && (
          <div className='text-center py-10 text-gray-500'>
            No notes found matching your filters.
          </div>
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmationModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title='Confirm Delete Note'
        message={
          <p>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </p>
        }
        confirmLabel='Delete'
        onConfirm={confirmDeleteNote}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        title='Edit User Note'
        note={editingNote}
        onSubmit={handleUpdateNote}
        submitLabel='Update Note'
      />

      {/* Selection Modal for Limit */}
      <SelectionModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title='Rows per page'
        options={limitOptions}
        selectedValue={limit}
        onSelect={(val) => setLimit(Number(val))}
      />
    </div>
  );
};
