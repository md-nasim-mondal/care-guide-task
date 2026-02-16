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
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MyNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params: any = {
        sortField: "createdAt",
        sortOrder,
        page,
        limit,
      };
      if (searchTerm) params.searchTerm = searchTerm;

      const res = await api.get("/notes", { params });
      setNotes(res?.data?.data);
      if (res?.data?.meta) {
        setTotalPages(res?.data?.meta?.totalPage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [limit, searchTerm]);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, page, limit, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await api.delete(`/notes/${noteToDelete}`);
      toast.success("Note deleted");
      setNoteToDelete(null);
      fetchNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  const openModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
    } else {
      setEditingNote(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      if (editingNote) {
        await api.patch(`/notes/${editingNote._id}`, data);
        toast.success("Note updated");
      } else {
        await api.post("/notes", data);
        toast.success("Note created");
      }
      closeModal();
      fetchNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save note");
    }
  };

  const sortOptions = [
    { label: "Newest", value: "desc" },
    { label: "Oldest", value: "asc" },
  ];

  const limitOptions = [
    { label: "3/page", value: 3 },
    { label: "6/page", value: 6 },
    { label: "9/page", value: 9 },
    { label: "18/page", value: 18 },
    { label: "27/page", value: 27 },
    { label: "45/page", value: 45 },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border'>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <h2 className='text-xl font-semibold whitespace-nowrap self-start md:self-center'>
            Your Notes
          </h2>
          <button
            onClick={() => openModal()}
            className='w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm whitespace-nowrap'>
            + Create Note
          </button>
        </div>

        <div className='flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto items-center'>
          <div className='flex gap-2 w-full md:w-auto'>
            <input
              type='text'
              placeholder='Search by title...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className='p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64'
            />
            <button
              onClick={handleSearch}
              className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm whitespace-nowrap'>
              Search
            </button>
          </div>
          <div className='flex gap-3 w-full md:w-auto'>
            <button
              onClick={() => setIsSortModalOpen(true)}
              className='flex-1 md:flex-none p-2 border rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto text-left min-w-25'>
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </button>
            <button
              onClick={() => setIsLimitModalOpen(true)}
              className='flex-1 md:flex-none p-2 border rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto text-left min-w-25'>
              {limit}/page
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='text-center py-10'>Loading...</div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notes?.map((note) => (
              <div
                key={note?._id}
                className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition relative group flex flex-col'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-bold text-lg pr-2 truncate flex-1'>
                    {note?.title}
                  </h3>
                </div>

                <p className='text-gray-600 text-sm mb-4 line-clamp-3 grow'>
                  {note?.content}
                </p>
                <div className='flex justify-between items-center mt-auto border-t pt-4'>
                  <Link
                    to={`/notes/${note?._id}`}
                    className='text-indigo-600 text-sm font-medium hover:underline'>
                    View Details
                  </Link>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => openModal(note)}
                      className='text-gray-500 hover:text-indigo-600 text-sm font-medium'>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note?._id)}
                      className='text-gray-500 hover:text-red-600 text-sm font-medium'>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {notes.length === 0 && (
            <div className='text-center py-10 bg-gray-50 rounded-lg border border-dashed text-gray-500'>
              No notes found matching your filters.
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        note={editingNote}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmationModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title='Confirm Delete'
        message={
          <p>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </p>
        }
        confirmLabel='Delete'
        onConfirm={confirmDelete}
      />

      <SelectionModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        title='Sort By'
        options={sortOptions}
        selectedValue={sortOrder}
        onSelect={(val) => setSortOrder(val as "asc" | "desc")}
      />

      <SelectionModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title='Notes per page'
        options={limitOptions}
        selectedValue={limit}
        onSelect={(val) => setLimit(Number(val))}
      />
    </div>
  );
};
