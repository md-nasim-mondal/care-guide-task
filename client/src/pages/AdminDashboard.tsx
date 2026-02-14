import { useState, useEffect } from "react";
import api from "../api/api";

interface Note {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface GroupedUser {
  _id: string; // interest
  users: User[];
  count: number;
}

import { useSearchParams } from "react-router";
import { toast } from "react-hot-toast";

interface Note {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface GroupedUser {
  _id: string; // interest
  users: User[];
  count: number;
}

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [users, setUsers] = useState<User[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ users: 0, notes: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!view) {
          // Fetch stats (mocked by fetching all and counting for now)
          const [usersRes, notesRes] = await Promise.all([
            api.get("/user/all-users"),
            api.get("/notes/all-notes"),
          ]);
          setStats({
            users: usersRes.data.data.length,
            notes: notesRes.data.data.length,
          });
          // Also set latest notes for activity feed if desired
          setAllNotes(notesRes.data.data.slice(0, 5));
        } else if (view === "users") {
          const res = await api.get("/user/all-users", {
            params: { sortField: "createdAt", sortOrder },
          });
          setUsers(res.data.data);
        } else if (view === "notes") {
          const res = await api.get("/notes/all-notes", {
            params: { sortField: "createdAt", sortOrder },
          });
          setAllNotes(res.data.data);
        } else if (view === "grouped") {
          // Grouped view might not need sorting or different endpoint
          const res = await api.get("/user/get-grouped-users-by-interests");
          setGroupedUsers(res.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view, sortOrder]);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        {view && view !== "grouped" && (
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className='p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'>
            <option value='desc'>Newest First</option>
            <option value='asc'>Oldest First</option>
          </select>
        )}
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
                    {stats.users}
                  </p>
                </div>
                <div className='bg-purple-50 p-6 rounded-lg border border-purple-100'>
                  <h3 className='text-purple-800 font-semibold mb-2'>
                    Total Notes
                  </h3>
                  <p className='text-4xl font-bold text-purple-600'>
                    {stats.notes}
                  </p>
                </div>
              </div>
              <div>
                <h2 className='text-xl font-bold mb-4'>Recent Notes</h2>
                {allNotes.length > 0 ? (
                  <div className='divide-y'>
                    {allNotes.map((n) => (
                      <div key={n._id} className='py-3'>
                        <p className='font-medium'>{n.title}</p>
                        <p className='text-sm text-gray-500'>
                          by {n.author?.name} ({n.author?.email})
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

          {view === "users" && (
            <div className='overflow-x-auto'>
              <h2 className='text-xl font-semibold mb-4'>All Users</h2>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className='px-6 py-4 whitespace-nowrap'>{u.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{u.email}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === "ADMIN" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === "notes" && (
            <div>
              <h2 className='text-xl font-semibold mb-4'>All Notes</h2>
              <div className='space-y-4'>
                {allNotes.map((n) => (
                  <div
                    key={n._id}
                    className='border p-4 rounded hover:shadow-sm transition'>
                    <h3 className='font-bold text-lg'>{n.title}</h3>
                    <p className='text-gray-700 mt-1'>{n.content}</p>
                    <div className='mt-2 pt-2 border-t flex justify-between items-center text-sm text-gray-500'>
                      <span>Author: {n.author?.name}</span>
                      <span>{n.author?.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "grouped" && (
            <div>
              <h2 className='text-xl font-semibold mb-4'>
                Users Grouped by Interest
              </h2>
              {groupedUsers.length === 0 && <p>No data available.</p>}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {groupedUsers.map((g) => (
                  <div key={g._id} className='p-4 border rounded bg-gray-50'>
                    <h3 className='font-bold text-lg capitalize mb-2 border-b pb-2 flex justify-between'>
                      {g._id || "No Interest"}
                      <span className='text-sm font-normal bg-white px-2 py-0.5 rounded border'>
                        {g.count} users
                      </span>
                    </h3>
                    <ul className='list-disc list-inside space-y-1 text-sm text-gray-700'>
                      {g.users.map((u) => (
                        <li key={u._id}>
                          {u.name}{" "}
                          <span className='text-gray-400'>({u.email})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
