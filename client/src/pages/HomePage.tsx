import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { LoadingPage } from "../components/common/LoadingPage";
import { Pagination } from "../components/common/Pagination";
import Footer from "../components/layout/Footer";

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
    <div className='min-h-screen flex flex-col pt-16 bg-linear-to-br from-indigo-100 via-purple-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8 grow'>
        {!user ? (
          <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
            <h1 className='text-4xl md:text-6xl font-extrabold text-indigo-600 mb-6 tracking-tight drop-shadow-sm'>
              Welcome to NoteApp
            </h1>
            <p className='text-lg md:text-xl text-gray-700 mb-10 max-w-2xl leading-relaxed'>
              The simple, secure way to keep your thoughts organized. Create,
              edit, and manage your notes with ease.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0'>
              <Link
                to='/login'
                className='px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg text-center hover:shadow-xl transform hover:-translate-y-0.5'>
                Get Started
              </Link>
              <Link
                to='/register'
                className='px-8 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-lg text-center hover:shadow-xl transform hover:-translate-y-0.5'>
                RegisterAccount
              </Link>
            </div>
          </div>
        ) : (
          <div className='h-full flex flex-col'>
            <h2 className='text-3xl font-bold mb-8 text-gray-800 border-b pb-4'>
              Your Notes
            </h2>
            {loading ? (
              <div className='flex justify-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
              </div>
            ) : notes.length === 0 ? (
              <div className='grow flex flex-col justify-center items-center text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300 shadow-sm'>
                <p className='text-gray-500 mb-6 text-lg'>
                  You don't have any notes yet.
                </p>
                <Link
                  to='/dashboard'
                  className='text-indigo-600 font-bold hover:text-indigo-700 hover:underline text-lg'>
                  Create one in Dashboard &rarr;
                </Link>
              </div>
            ) : (
              <div className='grow flex flex-col'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                  {notes.map((note) => (
                    <div
                      key={note?._id}
                      onClick={() => navigate(`/notes/${note?._id}`)}
                      className='bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group hover:-translate-y-1 h-full flex flex-col justify-between'>
                      <div>
                        <h3 className='text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors'>
                          {note?.title}
                        </h3>
                        <p className='text-gray-600 line-clamp-3 mb-4 leading-relaxed'>
                          {note?.content}
                        </p>
                      </div>
                      <div className='flex justify-between items-center text-xs text-gray-400 font-medium mt-auto pt-4 border-t border-gray-50'>
                        <span>
                          {new Date(note.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-auto flex justify-center pb-4'>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
