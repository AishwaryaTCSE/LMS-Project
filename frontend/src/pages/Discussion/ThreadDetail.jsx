import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getThreadDetail, postComment } from '../../api/discussionApi';
import Loader from '../../components/Loader';

const ThreadDetail = () => {
  const { id: threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await getThreadDetail(threadId);
        if (res.data.success) {
          setThread(res.data.data);
        } else {
          setError(res.data.message || 'Failed to load thread');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [threadId]);

  const handleCommentSubmit = async () => {
    if (!comment) return;
    setPosting(true);
    try {
      const res = await postComment(threadId, { message: comment });
      if (res.data.success) {
        setThread((prev) => ({
          ...prev,
          comments: [...prev.comments, res.data.data]
        }));
        setComment('');
      } else {
        alert(res.data.message || 'Failed to post comment');
      }
    } catch (err) {
      alert(err.message || 'Error posting comment');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">{thread.title}</h1>
      <p className="text-gray-600 mb-6">Author: {thread.author}</p>

      <div className="space-y-4">
        {thread.comments.map((c) => (
          <div key={c.id} className="p-3 bg-white rounded shadow flex flex-col">
            <span className="text-gray-700 font-semibold">{c.author}</span>
            <p className="text-gray-600">{c.message}</p>
            <span className="text-gray-400 text-sm mt-1">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
        />
        <button
          onClick={handleCommentSubmit}
          disabled={posting}
          className="px-6 py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors disabled:bg-gray-400"
        >
          {posting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
};

export default ThreadDetail;
