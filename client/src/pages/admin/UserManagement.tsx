import { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-hot-toast";
import { Pagination } from "../../components/common/Pagination";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { SelectionModal } from "../../components/common/SelectionModal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: string;
}

const UserManagement = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [userInputValue, setUserInputValue] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(
    null,
  );
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all-users", {
        params: {
          sortField: "createdAt",
          sortOrder: "desc",
          page,
          limit,
          searchTerm: userSearchTerm,
        },
      });
      setUsers(res?.data?.data);
      setTotalPages(res?.data?.meta?.totalPage);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, userSearchTerm]);

  const handleUserSearch = () => {
    setUserSearchTerm(userInputValue);
    setPage(1);
  };

  const handleUserKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUserSearch();
    }
  };

  const handleStatusChangeClick = (user: User) => {
    setUserToToggleStatus(user);
  };

  const confirmStatusChange = async () => {
    if (!userToToggleStatus) return;
    const newStatus =
      userToToggleStatus?.isActive === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      await api.patch(`/user/${userToToggleStatus?._id}`, {
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

  const handleRoleChange = async (newRole: any) => {
    if (!userToChangeRole) return;
    try {
      await api.patch(`/user/${userToChangeRole._id}`, { role: newRole });
      toast.success("User role updated");
      fetchUsers();
      setUserToChangeRole(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  };

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

  const limitOptions = [
    { label: "5 per page", value: 5 },
    { label: "10 per page", value: 10 },
    { label: "20 per page", value: 20 },
    { label: "50 per page", value: 50 },
  ];

  const roleOptions = [
    { label: "USER", value: "USER" },
    { label: "ADMIN", value: "ADMIN" },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row flex-wrap justify-between items-center gap-4'>
        <h2 className='text-xl font-semibold'>All Users</h2>
        <div className='flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto items-center'>
          <div className='flex gap-2 w-full md:w-auto'>
            <input
              type='text'
              placeholder='Search by name or email...'
              value={userInputValue}
              onChange={(e) => setUserInputValue(e.target.value)}
              onKeyDown={handleUserKeyDown}
              className='p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64'
            />
            <button
              onClick={handleUserSearch}
              className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm whitespace-nowrap'>
              Search
            </button>
          </div>
          <button
            onClick={() => setIsLimitModalOpen(true)}
            className='p-2 border rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto text-left min-w-30'>
            {limit} per page
          </button>
        </div>
      </div>

      <div className='overflow-x-auto rounded-lg shadow-sm border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200 hidden md:table'>
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
                <td className='px-6 py-4 whitespace-nowrap'>{u?.name}</td>
                <td className='px-6 py-4 whitespace-nowrap'>{u?.email}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => setUserToChangeRole(u)}
                    className='text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border focus:ring-2 focus:ring-indigo-500 px-3 py-1 hover:bg-gray-200 transition'>
                    {u?.role}
                  </button>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u?.isActive === "ACTIVE" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                    {u?.isActive}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <button
                    onClick={() => handleStatusChangeClick(u)}
                    className='text-indigo-600 hover:text-indigo-900 mr-4'>
                    {u?.isActive === "ACTIVE" ? "Block" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(u?._id)}
                    className='text-red-600 hover:text-red-900'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='md:hidden space-y-4 p-4 bg-gray-50'>
          {users.map((u) => (
            <div
              key={u._id}
              className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h3 className='font-bold text-gray-900'>{u?.name}</h3>
                  <p className='text-sm text-gray-500'>{u?.email}</p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${u?.isActive === "ACTIVE" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                  {u?.isActive}
                </span>
              </div>

              <div className='mt-2 flex items-center justify-between'>
                <button
                  onClick={() => setUserToChangeRole(u)}
                  className='text-xs font-semibold rounded border border-gray-300 text-gray-700 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 hover:bg-gray-50'>
                  {u?.role}
                </button>

                <div className='flex gap-3'>
                  <button
                    onClick={() => handleStatusChangeClick(u)}
                    className='text-sm font-medium text-indigo-600 hover:text-indigo-800'>
                    {u?.isActive === "ACTIVE" ? "Block" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(u?._id)}
                    className='text-sm font-medium text-red-600 hover:text-red-800'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title='Confirm Delete User'
        message={
          <p>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
        }
        confirmLabel='Delete'
        onConfirm={confirmDeleteUser}
      />

      <ConfirmationModal
        isOpen={!!userToToggleStatus}
        onClose={() => setUserToToggleStatus(null)}
        title='Confirm Status Change'
        message={
          <p>
            Are you sure you want to{" "}
            <span className='font-bold'>
              {userToToggleStatus?.isActive === "ACTIVE" ? "BLOCK" : "ACTIVATE"}
            </span>{" "}
            user <span className='font-bold'>{userToToggleStatus?.name}</span>?
          </p>
        }
        confirmLabel='Confirm'
        onConfirm={confirmStatusChange}
        confirmButtonClassName={
          userToToggleStatus?.isActive === "ACTIVE"
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }
      />

      {/* Selection Modals */}
      <SelectionModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title='Rows per page'
        options={limitOptions}
        selectedValue={limit}
        onSelect={(val) => setLimit(Number(val))}
      />

      <SelectionModal
        isOpen={!!userToChangeRole}
        onClose={() => setUserToChangeRole(null)}
        title={`Change Role for ${userToChangeRole?.name}`}
        options={roleOptions}
        selectedValue={userToChangeRole?.role || ""}
        onSelect={handleRoleChange}
      />
    </div>
  );
};

export default UserManagement;
