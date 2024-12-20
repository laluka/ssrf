import { useState, useEffect } from 'react';
import { StreamData } from '../types';
import { fetchStreamData } from '../services/api';

export function useStreamData() {
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchStreamData();
        setStreams(data);
        setError(null);
      } catch (err) {
        setError('Failed to load stream data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { streams, loading, error };
}