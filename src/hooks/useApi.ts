import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

interface UseApiResult<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: (token: string) => Promise<T>,
  fallback: T,
  options?: {
    refreshInterval?: number;
    enabled?: boolean;
  }
): UseApiResult<T> {
  const { accessToken } = useAuth();
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number>();
  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!accessToken || !enabled) {
      setData(fallback);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await fetcher(accessToken);
      setData(result);
      setError(null);
    } catch (err) {
      console.warn('API unavailable, using demo data:', err);
      setData(fallback);
      setError(err instanceof Error ? err.message : 'API unavailable');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, fetcher, fallback, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (options?.refreshInterval && enabled) {
      intervalRef.current = window.setInterval(fetchData, options.refreshInterval);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [fetchData, options?.refreshInterval, enabled]);

  return { data, isLoading, error, refetch: fetchData };
}
