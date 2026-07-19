import { useState, useEffect } from "react";
import type { AxiosResponse } from "axios";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>(fetcher: () => Promise<AxiosResponse<T>>): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((res) => {
        if (!cancelled) {
          setState({ data: res.data, isLoading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: err.response?.data?.message || "Something went wrong.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return state;
}
