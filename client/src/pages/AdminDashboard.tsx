/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import api from "../api/api";
import { toast, Toaster } from "react-hot-toast";
import { Pagination } from "../components/common/Pagination";
import { Modal } from "../components/common/Modal";

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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: string;
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
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // States for new features
  const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(
    null,
  );
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page when view changes
  useEffect(() => {
    setPage(1);
  }, [view]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/all-users", {
        params: { sortField: "createdAt", sortOrder, page, limit },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPage);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notes/all-notes", {
        params: { sortField: "createdAt", sortOrder, page, limit },
      });
      setAllNotes(res.data.data);
      if (res.data.meta) {
        setTotalPages(res.data.meta.totalPage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupedUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/get-grouped-users-by-interests");
      setGroupedUsers(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load grouped users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, notesRes] = await Promise.all([
        api.get("/user/all-users?limit=1"),
        api.get("/notes/all-notes?limit=5"),
      ]);

      setStats({
        users: usersRes.data.meta?.total || 0,
        notes: notesRes.data.meta?.total || 0,
      });
      setAllNotes(notesRes.data.data); // Recent notes
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!view) {
      fetchStats();
    } else if (view === "users") {
      fetchUsers();
    } else if (view === "notes") {
      fetchNotes();
    } else if (view === "grouped") {
      fetchGroupedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, sortOrder, page, limit]);

  // User Status Toggle
  const handleStatusChangeClick = (user: User) => {
    setUserToToggleStatus(user);
  };

  const confirmStatusChange = async () => {
    if (!userToToggleStatus) return;
    const newStatus =
      userToToggleStatus.isActive === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      await api.patch(`/user/${userToToggleStatus._id}`, {
        isActive: newStatus,
      });
      toast.success(`User ${newStatus}`);
      fetchUsers();
      setUserToToggleStatus(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  // User Role Change
  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistic UI update could be tricky with permissions, so we wait for API
    try {
      await api.patch(`/user/${userId}`, { role: newRole });
      toast.success("User role updated");
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update role");
      // Refresh to reset selection if failed
      fetchUsers();
    }
  };

  // User Delete
  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.patch(`/user/${userToDelete}`, { isDeleted: true });
      toast.success("User deleted");
      fetchUsers();
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  // Note Actions
  const openNoteModal = (note?: Note) => {
    setEditingNote(note || null);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setEditingNote(null);
    setIsNoteModalOpen(false);
  };

  const handleUpdateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingNote) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await api.patch(`/notes/${editingNote._id}`, data);
      toast.success("Note updated");
      closeNoteModal();
      fetchNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNoteClick = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const confirmDeleteNote = async () => {
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

  return (
    <div className='container mx-auto p-4'>
      <Toaster />
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
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className='px-6 py-4 whitespace-nowrap'>{u.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{u.email}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value)
                          }
                          className='text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border-none focus:ring-2 focus:ring-indigo-500'>
                          <option value='USER'>USER</option>
                          <option value='ADMIN'>ADMIN</option>
                          {/* Super Admin usually handled via DB or separate process, but let's include for completeness if needed */}
                          {/* <option value="SUPER_ADMIN">SUPER_ADMIN</option> */}
                        </select>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive === "ACTIVE" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                          {u.isActive}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <button
                          onClick={() => handleStatusChangeClick(u)}
                          className='text-indigo-600 hover:text-indigo-900 mr-4'>
                          {u.isActive === "ACTIVE" ? "Block" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(u._id)}
                          className='text-red-600 hover:text-red-900'>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {view === "notes" && (
            <div className='overflow-x-auto'>
              <h2 className='text-xl font-semibold mb-4'>
                All Notes Management
              </h2>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Title
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Content
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Author
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {allNotes.map((n) => (
                    <tr key={n._id}>
                      <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-900'>
                        {n.title}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-500 line-clamp-2 max-w-xs'>
                          {n.content}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {n.author?.name}
                        <br />
                        <span className='text-xs text-gray-400'>
                          {n.author?.email}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <button
                          onClick={() => openNoteModal(n)}
                          className='text-indigo-600 hover:text-indigo-900 mr-4'>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNoteClick(n._id)}
                          className='text-red-600 hover:text-red-900'>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
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

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title='Confirm Delete User'>
        <div className='space-y-4'>
          <p className='text-gray-600'>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className='flex gap-3 justify-end'>
            <button
              onClick={() => setUserToDelete(null)}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium'>
              Cancel
            </button>
            <button
              onClick={confirmDeleteUser}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium'>
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm User Status Change Modal */}
      <Modal
        isOpen={!!userToToggleStatus}
        onClose={() => setUserToToggleStatus(null)}
        title='Confirm Status Change'>
        <div className='space-y-4'>
          <p className='text-gray-600'>
            Are you sure you want to{" "}
            <span className='font-bold'>
              {userToToggleStatus?.isActive === "ACTIVE" ? "BLOCK" : "ACTIVATE"}
            </span>{" "}
            user <span className='font-bold'>{userToToggleStatus?.name}</span>?
          </p>
          <div className='flex gap-3 justify-end'>
            <button
              onClick={() => setUserToToggleStatus(null)}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium'>
              Cancel
            </button>
            <button
              onClick={confirmStatusChange}
              className={`px-4 py-2 text-white rounded-md transition text-sm font-medium ${userToToggleStatus?.isActive === "ACTIVE" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}>
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        title='Edit User Note'>
        <form onSubmit={handleUpdateNote} className='space-y-4'>
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
              Update Note
            </button>
            <button
              type='button'
              onClick={closeNoteModal}
              className='flex-1 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Note Confirmation Modal */}
      <Modal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title='Confirm Delete Note'>
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
              onClick={confirmDeleteNote}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium'>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
