import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Pagination } from "../components/common/Pagination";
import { Modal } from "../components/common/Modal";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notes", {
        params: { sortField: "createdAt", sortOrder, page, limit },
      });
      setNotes(res.data.data);
      if (res.data.meta) {
        setTotalPages(res.data.meta.totalPage);
        setTotalNotes(res.data.meta.total);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "notes") {
      fetchNotes();
    } else {
      const fetchStats = async () => {
        try {
          const res = await api.get("/notes?limit=3");
          setTotalNotes(res.data.meta?.total || 0);
          setNotes(res.data.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, sortOrder, page, limit]);

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
  };

  const confirmDelete = async () => {
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

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>
        {view === "notes" ? "My Notes" : "Dashboard Overview"}
      </h1>

      {!view && (
        <div>
          <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-xl font-semibold mb-4'>
              Welcome back, {user?.name}!
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-blue-50 p-6 rounded-lg border border-blue-100'>
                <h3 className='text-blue-800 font-semibold'>Total Notes</h3>
                <p className='text-4xl font-bold text-blue-600'>{totalNotes}</p>
              </div>
              <div className='bg-green-50 p-6 rounded-lg border border-green-100'>
                <h3 className='text-green-800 font-semibold'>Status</h3>
                <p className='text-xl font-bold text-green-600 uppercase'>
                  {user?.isActive || "ACTIVE"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-4'>Recent Notes</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {notes.slice(0, 3).map((note) => (
                <div
                  key={note._id}
                  className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition'>
                  <h3 className='font-bold text-lg mb-2 truncate'>
                    {note.title}
                  </h3>
                  <p className='text-gray-600 text-sm line-clamp-3'>
                    {note.content}
                  </p>
                  <Link
                    to={`/notes/${note._id}`}
                    className='text-indigo-600 text-sm mt-4 inline-block font-medium hover:underline'>
                    Read more
                  </Link>
                </div>
              ))}
            </div>
            {notes.length === 0 && (
              <p className='text-gray-500'>
                You haven't created any notes yet.
              </p>
            )}
            <div className='mt-6'>
              <Link
                to='/dashboard?view=notes'
                className='text-indigo-600 font-medium hover:text-indigo-800'>
                View all notes &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {view === "notes" && (
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <h2 className='text-xl font-semibold'>Your Notes</h2>
              <button
                onClick={() => openModal()}
                className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm'>
                + Create Note
              </button>
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className='p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'>
              <option value='desc'>Newest First</option>
              <option value='asc'>Oldest First</option>
            </select>
          </div>

          {loading ? (
            <div className='text-center py-10'>Loading...</div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition relative group flex flex-col'>
                    <h3 className='font-bold text-lg mb-2 pr-8 truncate'>
                      {note.title}
                    </h3>
                    <p className='text-gray-600 text-sm mb-4 line-clamp-3 grow'>
                      {note.content}
                    </p>
                    <div className='flex justify-between items-center mt-auto border-t pt-4'>
                      <Link
                        to={`/notes/${note._id}`}
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
                          onClick={() => handleDeleteClick(note._id)}
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
                  No notes found. Create your first note!
                </div>
              )}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingNote ? "Edit Note" : "Create New Note"}>
        <form onSubmit={handleCreateOrUpdate} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Title
            </label>
            <input
              type='text'
              name='title'
              defaultValue={editingNote?.title}
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
              defaultValue={editingNote?.content}
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
              placeholder='Write your note content here...'></textarea>
          </div>
          <div className='flex gap-3 pt-2'>
            <button
              type='submit'
              className='flex-1 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              {editingNote ? "Update Note" : "Create Note"}
            </button>
            <button
              type='button'
              onClick={closeModal}
              className='flex-1 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title='Confirm Delete'>
        <div className='space-y-4'>
          <p className='text-gray-600'>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </p>
          <div className='flex gap-3 justify-end'>
            <button
              onClick={() => setNoteToDelete(null)}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium'>
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium'>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
