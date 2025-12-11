import { useEffect, useRef } from 'react';

/**
 * Previous Value Hook
 * Returns the previous value of a state or prop
 * 
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * // prevCount will be undefined on first render, then the previous count value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Previous Value with Initial Value Hook
 * 
 * @example
 * const prevCount = usePreviousWithInitial(count, 0);
 * // prevCount will be 0 on first render, then the previous count value
 */
export function usePreviousWithInitial<T>(value: T, initialValue: T): T {
  const ref = useRef<T>(initialValue);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Previous Distinct Value Hook
 * Only updates if the value actually changed
 * 
 * @example
 * const prevValue = usePreviousDistinct(value);
 */
export function usePreviousDistinct<T>(
  value: T,
  compare: (a: T, b: T) => boolean = (a, b) => a === b
): T | undefined {
  const ref = useRef<T>();
  const prevRef = useRef<T>();
  
  if (!compare(value, ref.current as T)) {
    prevRef.current = ref.current;
    ref.current = value;
  }
  
  return prevRef.current;
}
