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

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUser[]>([]);
  const [view, setView] = useState<"users" | "notes" | "grouped">("users");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/user/all-users");
      setUsers(res.data.data);
    };

    const fetchNotes = async () => {
      const res = await api.get("/notes/all-notes");
      setAllNotes(res.data.data);
    };

    const fetchGroupedUsers = async () => {
      const res = await api.get("/user/get-grouped-users-by-interests");
      setGroupedUsers(res.data.data);
    };

    if (view === "users") fetchUsers();
    if (view === "notes") fetchNotes();
    if (view === "grouped") fetchGroupedUsers();
  }, [view]);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>
      <div className='flex gap-4 mb-6'>
        <button
          onClick={() => setView("users")}
          className={`px-4 py-2 rounded ${view === "users" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
          Users
        </button>
        <button
          onClick={() => setView("notes")}
          className={`px-4 py-2 rounded ${view === "notes" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
          All Notes
        </button>
        <button
          onClick={() => setView("grouped")}
          className={`px-4 py-2 rounded ${view === "grouped" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
          Grouped by Interests
        </button>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md'>
        {view === "users" && (
          <div>
            <h2 className='text-xl font-semibold mb-4'>All Users</h2>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
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
                    <td className='px-6 py-4 whitespace-nowrap'>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "notes" && (
          <div>
            <h2 className='text-xl font-semibold mb-4'>All Notes</h2>
            {allNotes.map((n) => (
              <div key={n._id} className='border-b py-4'>
                <h3 className='font-bold'>{n.title}</h3>
                <p>{n.content}</p>
                <p className='text-sm text-gray-500'>
                  Author: {n.author.name} ({n.author.email})
                </p>
              </div>
            ))}
          </div>
        )}

        {view === "grouped" && (
          <div>
            <h2 className='text-xl font-semibold mb-4'>
              Users Grouped by Interest
            </h2>
            {groupedUsers.map((g) => (
              <div key={g._id} className='mb-6 p-4 border rounded'>
                <h3 className='font-bold text-lg capitalize'>
                  {g._id}{" "}
                  <span className='text-sm font-normal text-gray-500'>
                    ({g.count} users)
                  </span>
                </h3>
                <ul className='list-disc list-inside mt-2'>
                  {g.users.map((u) => (
                    <li key={u._id}>
                      {u.name} ({u.email})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
