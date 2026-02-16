import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import api from "../api/api";
import { UserManagement } from "../components/admin/UserManagement";
import { NotesManagement } from "../components/admin/NotesManagement";
import { GroupedUsers } from "../components/admin/GroupedUsers";

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

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const [stats, setStats] = useState({ users: 0, notes: 0 });
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, notesRes] = await Promise.all([
        api.get("/user/all-users?limit=1"),
        api.get("/notes/all-notes?limit=5"),
      ]);

      setStats({
        users: usersRes?.data?.meta?.total || 0,
        notes: notesRes?.data?.meta?.total || 0,
      });
      setRecentNotes(notesRes?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!view) {
      fetchStats();
    }
  }, [view]);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      </div>

      {loading ? (
        <div className='text-center py-10'>Loading...</div>
      ) : (
        <div className='bg-white p-6 rounded-lg shadow-md'>
          {!view && (
            <div className='space-y-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-indigo-50 p-6 rounded-lg border border-indigo-100'>
                  <h3 className='text-indigo-800 font-semibold mb-2'>
                    Total Users
                  </h3>
                  <p className='text-4xl font-bold text-indigo-600'>
                    {stats?.users}
                  </p>
                </div>
                <div className='bg-purple-50 p-6 rounded-lg border border-purple-100'>
                  <h3 className='text-purple-800 font-semibold mb-2'>
                    Total Notes
                  </h3>
                  <p className='text-4xl font-bold text-purple-600'>
                    {stats?.notes}
                  </p>
                </div>
              </div>
              <div>
                <h2 className='text-xl font-bold mb-4'>Recent Notes</h2>
                {recentNotes.length > 0 ? (
                  <div className='divide-y'>
                    {recentNotes.map((n) => (
                      <div key={n._id} className='py-3'>
                        <p className='font-medium'>{n?.title}</p>
                        <p className='text-sm text-gray-500'>
                          by {n?.author?.name} ({n?.author?.email})
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent activity.</p>
                )}
              </div>
            </div>
          )}

          {view === "users" && <UserManagement />}

          {view === "notes" && <NotesManagement />}

          {view === "grouped" && <GroupedUsers />}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
