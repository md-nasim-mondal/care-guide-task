import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { toast } from "react-hot-toast";

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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  // Fetch Stats or Notes based on view
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notes", {
          params: { sortField: "createdAt", sortOrder },
        });
        setNotes(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortOrder, view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.patch(`/notes/${isEditing}`, { title, content });
        toast.success("Note updated");
        setIsEditing(null);
      } else {
        await api.post("/notes", { title, content });
        toast.success("Note created");
      }
      setTitle("");
      setContent("");
      // Refresh data
      const res = await api.get("/notes", {
        params: { sortField: "createdAt", sortOrder },
      });
      setNotes(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await api.delete(`/notes/${id}`);
        toast.success("Note deleted");
        const res = await api.get("/notes", {
          params: { sortField: "createdAt", sortOrder },
        });
        setNotes(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Delete failed");
      }
    }
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(note._id);
  };

  if (!view) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Dashboard Overview</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500'>
            <h3 className='text-gray-500 text-sm uppercase font-semibold'>
              Total Notes
            </h3>
            <p className='text-3xl font-bold text-gray-800 mt-2'>
              {notes.length}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500'>
            <h3 className='text-gray-500 text-sm uppercase font-semibold'>
              User Status
            </h3>
            <p className='text-3xl font-bold text-gray-800 mt-2 capitalize'>
              {user?.status || "Active"}
            </p>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-bold mb-4'>Recent Notes</h2>
          {notes.slice(0, 5).map((note) => (
            <div key={note._id} className='border-b py-3 last:border-0'>
              <h3 className='font-semibold'>{note.title}</h3>
              <p className='text-sm text-gray-500'>
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {notes.length === 0 && (
            <p className='text-gray-500'>No notes created yet.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className=''>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>My Notes</h1>
        <div className='flex items-center'>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className='mr-4 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'>
            <option value='desc'>Newest First</option>
            <option value='asc'>Oldest First</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Create/Edit Form */}
        <div className='md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit top-4 sticky'>
          <h2 className='text-xl font-semibold mb-4'>
            {isEditing ? "Edit Note" : "Create Note"}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Title
              </label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
                rows={4}
              />
            </div>
            <div className='flex gap-2'>
              <button
                type='submit'
                className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition'>
                {isEditing ? "Update" : "Create"}
              </button>
              {isEditing && (
                <button
                  type='button'
                  onClick={() => {
                    setIsEditing(null);
                    setTitle("");
                    setContent("");
                  }}
                  className='w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition'>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div className='md:col-span-2 space-y-4'>
          {loading ? (
            <div className='text-center py-4'>Loading...</div>
          ) : notes.length === 0 ? (
            <p className='text-gray-500 text-center py-8 bg-white rounded-lg'>
              No notes found.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition'>
                <h3 className='text-xl font-semibold'>{note.title}</h3>
                <p className='mt-2 text-gray-600 whitespace-pre-wrap line-clamp-3'>
                  {note.content}
                </p>
                <div className='mt-4 flex justify-between items-center'>
                  <span className='text-xs text-gray-400'>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEdit(note)}
                      className='text-indigo-600 hover:text-indigo-800 font-medium text-sm'>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className='text-red-600 hover:text-red-800 font-medium text-sm'>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
