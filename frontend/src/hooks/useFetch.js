// useFetch.js
import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance.js';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios({ url, ...options });
        if (isMounted) setData(response.data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();

    return () => {
      isMounted = false; // Prevent setting state on unmounted component
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

export default useFetch;
