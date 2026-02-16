import { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-hot-toast";
import { Pagination } from "../../components/common/Pagination";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { SelectionModal } from "../../components/common/SelectionModal";
import { PostModal } from "../../components/posts/PostModal";

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

const PostManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sortField: "createdAt",
        sortOrder: "desc",
        searchTerm,
      };
      const res = await api.get("/posts", { params });
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
    setPage(1);
  }, [limit, searchTerm]);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
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

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/posts/${postToDelete}`);
      toast.success("Post deleted");
      fetchPosts();
      setPostToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  };

  const limitOptions = [
    { label: "5 per page", value: 5 },
    { label: "10 per page", value: 10 },
    { label: "20 per page", value: 20 },
    { label: "50 per page", value: 50 },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row flex-wrap justify-between items-center gap-4'>
        <h2 className='text-xl font-semibold'>All Posts Management</h2>
        <div className='flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto items-center'>
          <div className='flex gap-2 w-full md:w-auto'>
            <input
              type='text'
              placeholder='Search post content...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className='p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64'
            />
            <button
              onClick={handleSearch}
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
                Content
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Author
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Created At
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {posts.map((post) => (
              <tr key={post._id}>
                <td className='px-6 py-4'>
                  <div className='max-w-xs truncate' title={post.content}>
                    {post.content}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {post.author.name}
                  <br />
                  <span className='text-xs text-gray-400'>
                    {post.author.email}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setEditingPost(post)}
                      className='text-indigo-600 hover:text-indigo-900'>
                      Edit
                    </button>
                    <button
                      onClick={() => setPostToDelete(post._id)}
                      className='text-red-600 hover:text-red-900'>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='md:hidden space-y-4 p-4 bg-gray-50'>
          {posts.map((post) => (
            <div
              key={post._id}
              className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
              <div className='mb-2'>
                <h3 className='font-bold text-gray-900 mb-1'>
                  {post.author.name}
                </h3>
                <p className='text-xs text-gray-500'>{post.author.email}</p>
              </div>
              <p className='text-sm text-gray-600 line-clamp-3 mb-3'>
                {post.content}
              </p>
              <div className='flex justify-end gap-3'>
                <button
                  onClick={() => setEditingPost(post)}
                  className='text-sm font-medium text-indigo-600 hover:text-indigo-800'>
                  Edit
                </button>
                <button
                  onClick={() => setPostToDelete(post._id)}
                  className='text-sm font-medium text-red-600 hover:text-red-800'>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {!loading && posts.length === 0 && (
          <div className='text-center py-10 text-gray-500'>No posts found.</div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmationModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        title='Confirm Delete Post'
        message={
          <p>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
        }
        confirmLabel='Delete'
        onConfirm={handleDeletePost}
      />

      <SelectionModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title='Rows per page'
        options={limitOptions}
        selectedValue={limit}
        onSelect={(val) => setLimit(Number(val))}
      />

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

export default PostManagement;
