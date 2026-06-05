import { useState, useEffect } from 'react';

/**
 * Custom hook to handle API data fetching with loading and error states.
 * @param {string} url - The endpoint to fetch data from.
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create an AbortController to cancel the request if the component unmounts
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, { signal });
        
        // Throw error if response status is not OK (200-299)
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        // Only update error state if the fetch wasn't intentionally aborted
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort(); // Cleanup: cancel request on unmount
  }, [url]);

  return { data, loading, error };
};

export default useFetch;