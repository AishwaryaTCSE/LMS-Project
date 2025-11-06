import React, { useState, useEffect } from 'react';
import { getAllThreads } from '../../api/discussionApi';
import Loader from '../../components/Loader';

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [threadsPerPage] = useState(5);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await getAllThreads();
        if (res.data.success) {
          setThreads(res.data.data);
        } else {
          setError(res.data.message || 'Failed to load threads');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastThread = currentPage * threadsPerPage;
  const indexOfFirstThread = indexOfLastThread - threadsPerPage;
  const currentThreads = filteredThreads.slice(indexOfFirstThread, indexOfLastThread);
  const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Discussion Forum</h1>

      <input
        type="text"
        placeholder="Search threads..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="space-y-4">
        {currentThreads.map((thread) => (
          <div
            key={thread.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{thread.title}</h2>
            <p className="text-gray-600 mb-2">Author: {thread.author}</p>
            <p className="text-gray-500 text-sm">{thread.replies} replies</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-400"
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-indigo-700 text-white' : 'bg-indigo-300 text-black'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Forum;
