import { useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { PostModal } from "../components/posts/PostModal";

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const CommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts", {
        params: { page, limit, sortField: "createdAt", sortOrder: "desc" },
      });
      setPosts(res?.data?.data);
      if (res?.data?.meta) {
        setTotalPages(res?.data?.meta?.totalPage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await api.post("/posts", { content: newPostContent });
      toast.success("Post created successfully");
      setNewPostContent("");
      fetchPosts(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    }
  };

  const handleUpdatePost = async (content: string) => {
    if (!editingPost) return;
    try {
      await api.patch(`/posts/${editingPost._id}`, { content });
      toast.success("Post updated successfully");
      fetchPosts();
      setEditingPost(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className='container mx-auto p-4 max-w-3xl'>
      <h1 className='text-3xl font-bold mb-6'>Community Feed</h1>

      {/* Create Post Section */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
        <h2 className='text-lg font-semibold mb-4'>Create a Post</h2>
        <form onSubmit={handleCreatePost}>
          <textarea
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-25'
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            required
          />
          <div className='flex justify-end mt-3'>
            <button
              type='submit'
              className='bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition font-medium'>
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className='space-y-6'>
        {loading ? (
          <div className='text-center py-10'>Loading posts...</div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition'>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <h3 className='font-bold text-gray-900'>
                    {post.author.name}
                  </h3>
                  <p className='text-xs text-gray-500'>
                    {new Date(post.createdAt).toLocaleDateString()} at{" "}
                    {new Date(post.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {(user?.role === "ADMIN" ||
                  user?.role === "SUPER_ADMIN" ||
                  user?._id === post.author._id) && (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setEditingPost(post)}
                      className='text-indigo-600 hover:text-indigo-800 text-sm font-medium'>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className='text-red-500 hover:text-red-700 text-sm font-medium'>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className='text-gray-800 whitespace-pre-wrap'>
                {post.content}
              </p>
            </div>
          ))
        )}

        {!loading && posts.length === 0 && (
          <div className='text-center py-10 text-gray-500'>
            No posts yet. Be the first to share something!
          </div>
        )}

        {/* Simple Pagination */}
        <div className='flex justify-center gap-2 mt-6'>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className='px-4 py-2 border rounded disabled:opacity-50'>
            Previous
          </button>
          <span className='px-4 py-2'>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className='px-4 py-2 border rounded disabled:opacity-50'>
            Next
          </button>
        </div>
      </div>

      <PostModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSubmit={handleUpdatePost}
        initialContent={editingPost?.content}
        title='Edit Post'
      />
    </div>
  );
};

export default CommunityFeed;
