import { useState, useEffect } from 'react';

/**
 * Custom hook to handle API data fetching with loading and error states.
 * @param {string} url - The endpoint to fetch data from.
 */
const useFetch = (url) => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        setProducts(result.products);
        setError(null);
      } catch (err) {
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

  return { products, loading, error };
};

export default useFetch;