import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Async status type
 */
export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * Async state
 */
export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Async Hook
 * Manages async operations with loading, error, and data states
 * 
 * @example
 * const { data, error, isPending, execute } = useAsync(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * });
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): AsyncState<T> & {
  execute: () => Promise<T | null>;
  reset: () => void;
} {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  
  const execute = useCallback(async (): Promise<T | null> => {
    setStatus('pending');
    setData(null);
    setError(null);
    
    try {
      const response = await asyncFunction();
      
      if (mountedRef.current) {
        setData(response);
        setStatus('success');
        return response;
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
        setStatus('error');
      }
    }
    
    return null;
  }, [asyncFunction]);
  
  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [execute, immediate]);
  
  return {
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    execute,
    reset,
  };
}

/**
 * Async Hook with Params
 * 
 * @example
 * const { data, execute } = useAsyncWithParams(async (id: number) => {
 *   const response = await fetch(`/api/data/${id}`);
 *   return response.json();
 * });
 * 
 * execute(123);
 */
export function useAsyncWithParams<T, P extends any[]>(
  asyncFunction: (...params: P) => Promise<T>
): AsyncState<T> & {
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
} {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  
  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setStatus('pending');
      setData(null);
      setError(null);
      
      try {
        const response = await asyncFunction(...params);
        
        if (mountedRef.current) {
          setData(response);
          setStatus('success');
          return response;
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
          setStatus('error');
        }
      }
      
      return null;
    },
    [asyncFunction]
  );
  
  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  return {
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    execute,
    reset,
  };
}

/**
 * Async Hook with Retry
 * 
 * @example
 * const { data, retry } = useAsyncWithRetry(
 *   async () => fetch('/api/data'),
 *   { retries: 3, retryDelay: 1000 }
 * );
 */
export function useAsyncWithRetry<T>(
  asyncFunction: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    immediate?: boolean;
  } = {}
): AsyncState<T> & {
  execute: () => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
  attemptsLeft: number;
} {
  const { retries = 3, retryDelay = 1000, immediate = true } = options;
  
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(retries);
  const mountedRef = useRef(true);
  
  const executeWithRetry = useCallback(
    async (remainingAttempts: number = retries): Promise<T | null> => {
      setStatus('pending');
      setAttemptsLeft(remainingAttempts);
      
      try {
        const response = await asyncFunction();
        
        if (mountedRef.current) {
          setData(response);
          setStatus('success');
          setError(null);
          return response;
        }
      } catch (err) {
        if (remainingAttempts > 0 && mountedRef.current) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          
          if (mountedRef.current) {
            return executeWithRetry(remainingAttempts - 1);
          }
        } else if (mountedRef.current) {
          setError(err as Error);
          setStatus('error');
        }
      }
      
      return null;
    },
    [asyncFunction, retries, retryDelay]
  );
  
  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
    setAttemptsLeft(retries);
  }, [retries]);
  
  useEffect(() => {
    if (immediate) {
      executeWithRetry();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [executeWithRetry, immediate]);
  
  return {
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    execute: () => executeWithRetry(retries),
    retry: () => executeWithRetry(attemptsLeft),
    reset,
    attemptsLeft,
  };
}
