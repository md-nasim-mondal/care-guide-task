import { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: string;
}

interface GroupedUser {
  _id: string;
  users: User[];
  count: number;
}

export const GroupedUsers = () => {
  const [groupedUsers, setGroupedUsers] = useState<GroupedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroupedUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/get-grouped-users-by-interests");
      setGroupedUsers(res?.data?.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load grouped users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedUsers();
  }, []);

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Users Grouped by Interest</h2>
      {loading && <p>Loading...</p>}
      {!loading && groupedUsers.length === 0 && <p>No data available.</p>}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {groupedUsers.map((g) => (
          <div key={g._id} className='p-4 border rounded bg-gray-50'>
            <h3 className='font-bold text-lg capitalize mb-2 border-b pb-2 flex justify-between'>
              {g?._id || "No Interest"}
              <span className='text-sm font-normal bg-white px-2 py-0.5 rounded border'>
                {g?.count} users
              </span>
            </h3>
            <ul className='list-disc list-inside space-y-1 text-sm text-gray-700'>
              {g?.users?.map((u) => (
                <li key={u._id}>
                  {u?.name} <span className='text-gray-400'>({u?.email})</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
