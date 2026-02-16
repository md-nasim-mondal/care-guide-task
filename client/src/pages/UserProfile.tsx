import { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../api/api";
import { toast } from "react-hot-toast";

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  author: string; // ID only in aggregation result usually, but let's check response
}

interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  posts: Post[];
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Using the aggregation endpoint as required by Scenario 2
        const res = await api.get(`/user/get-user-posts/${id}`);
        setProfileData(res?.data?.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <div className='text-center py-10'>Loading profile...</div>;
  }

  if (!profileData) {
    return <div className='text-center py-10'>User not found</div>;
  }

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden mb-6'>
        <div className='bg-indigo-600 h-32'></div>
        <div className='px-6 py-4 relative'>
          <div className='absolute -top-16 left-6'>
            <div className='h-24 w-24 rounded-full bg-white p-1 shadow-lg'>
              <div className='h-full w-full rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold'>
                {profileData.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <div className='mt-10'>
            <h1 className='text-2xl font-bold text-gray-900'>
              {profileData.name}
            </h1>
            <p className='text-gray-600'>{profileData.email}</p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-bold mb-4 border-b pb-2'>
          Posts by {profileData.name}
        </h2>

        {profileData.posts && profileData.posts.length > 0 ? (
          <div className='space-y-4'>
            {profileData.posts.map((post) => (
              <div
                key={post._id}
                className='p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition'>
                <p className='text-gray-800 whitespace-pre-wrap mb-2'>
                  {post.content}
                </p>
                <p className='text-xs text-gray-500 text-right'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 italic'>
            This user hasn't posted anything yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
