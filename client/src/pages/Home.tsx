import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { LoadingPage } from "../components/common/LoadingPage";
import { Pagination } from "../components/common/Pagination";

interface Note {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // 3x3 grid
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user) {
      const fetchNotes = async () => {
        setLoading(true);
        try {
          const res = await api.get("/notes", {
            params: { page, limit, sortField: "createdAt", sortOrder: "desc" },
          });
          setNotes(res.data.data);
          if (res.data.meta) {
            setTotalPages(res.data.meta.totalPage);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchNotes();
    }
  }, [user, page, limit]);

  if (authLoading) return <LoadingPage />;

  return (
    <div className='container mx-auto px-4 py-8'>
      {!user ? (
        <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
          <h1 className='text-5xl font-bold text-indigo-600 mb-6'>
            Welcome to NoteApp
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl'>
            The simple, secure way to keep your thoughts organized. Create,
            edit, and manage your notes with ease.
          </p>
          <div className='flex gap-4'>
            <Link
              to='/login'
              className='px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg'>
              Get Started
            </Link>
            <Link
              to='/register'
              className='px-8 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition shadow-lg'>
              Register
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <h2 className='text-2xl font-bold mb-6 text-gray-800'>Your Notes</h2>
          {loading ? (
            <div className='flex justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
            </div>
          ) : notes.length === 0 ? (
            <div className='text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
              <p className='text-gray-500 mb-4'>
                You don't have any notes yet.
              </p>
              <Link
                to='/dashboard'
                className='text-indigo-600 font-medium hover:underline'>
                Create one in Dashboard &rarr;
              </Link>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {notes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => navigate(`/notes/${note._id}`)}
                    className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 cursor-pointer group'>
                    <h3 className='text-xl font-semibold mb-2 group-hover:text-indigo-600 transition'>
                      {note.title}
                    </h3>
                    <p className='text-gray-600 line-clamp-3 mb-4'>
                      {note.content}
                    </p>
                    <div className='flex justify-between items-center text-xs text-gray-400'>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
