import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

interface Note {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes"); // /notes returns own notes
      setNotes(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (user) {
      const loadNotes = async () => {
        try {
          const res = await api.get("/notes");
          setNotes(res.data.data);
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch notes");
        }
      };
      loadNotes();
    }
  }, [user, loading, navigate]);

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
      fetchNotes();
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
        fetchNotes();
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>My Notes</h1>
        <div>
          <span className='mr-4'>Welcome, {user?.name}</span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit'>
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
                className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700'>
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
                  className='w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600'>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className='md:col-span-2 space-y-4'>
          {notes.length === 0 ? (
            <p className='text-gray-500'>No notes found.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition'>
                <h3 className='text-xl font-semibold'>{note.title}</h3>
                <p className='mt-2 text-gray-600 whitespace-pre-wrap'>
                  {note.content}
                </p>
                <div className='mt-4 flex justify-end gap-2'>
                  <button
                    onClick={() => handleEdit(note)}
                    className='text-indigo-600 hover:text-indigo-800'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className='text-red-600 hover:text-red-800'>
                    Delete
                  </button>
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
