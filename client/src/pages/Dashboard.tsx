import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { MyNotes } from "../components/dashboard/MyNotes";

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
  const [totalNotes, setTotalNotes] = useState(0);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!view) {
      const fetchOverview = async () => {
        try {
          const res = await api.get("/notes?limit=3");
          setTotalNotes(res?.data?.meta?.total || 0);
          setRecentNotes(res?.data?.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchOverview();
    }
  }, [view]);

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
              {recentNotes.slice(0, 3).map((note) => (
                <div
                  key={note._id}
                  className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition relative'>
                  <h3 className='font-bold text-lg mb-2 truncate'>
                    {note?.title}
                  </h3>
                  <p className='text-gray-600 text-sm line-clamp-3'>
                    {note?.content}
                  </p>
                  <Link
                    to={`/notes/${note?._id}`}
                    className='text-indigo-600 text-sm mt-4 inline-block font-medium hover:underline'>
                    Read more
                  </Link>
                </div>
              ))}
            </div>
            {recentNotes.length === 0 && (
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

      {view === "notes" && <MyNotes />}
    </div>
  );
};

export default Dashboard;
