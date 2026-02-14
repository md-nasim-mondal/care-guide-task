import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/api";
import { LoadingPage } from "../components/common/LoadingPage";

interface Note {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  if (loading) return <LoadingPage />;

  if (!note) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h2 className='text-2xl font-bold text-gray-700'>Note not found</h2>
        <button
          onClick={() => navigate(-1)}
          className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10'>
      <button
        onClick={() => navigate(-1)}
        className='mb-6 text-indigo-600 hover:text-indigo-800 font-medium'>
        &larr; Back
      </button>
      <h1 className='text-3xl font-bold mb-4'>{note.title}</h1>
      <div className='flex items-center text-sm text-gray-500 mb-6 border-b pb-4'>
        <span className='mr-4'>By {note.author.name}</span>
        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
      </div>
      <div className='prose max-w-none text-gray-800 whitespace-pre-wrap'>
        {note.content}
      </div>
    </div>
  );
};

export default NoteDetails;
