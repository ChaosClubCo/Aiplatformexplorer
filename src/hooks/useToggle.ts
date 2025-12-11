import { useState, useCallback } from 'react';

/**
 * Toggle Hook
 * Manages boolean state with toggle, set, and reset functions
 * 
 * @example
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 * <button onClick={toggle}>Toggle</button>
 * <button onClick={() => setIsOpen(true)}>Open</button>
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void, () => void] {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  return [value, toggle, setValue, reset];
}

/**
 * Multi-Toggle Hook
 * Manages multiple boolean states
 * 
 * @example
 * const { isOpen, isLoading, toggle, set } = useMultiToggle({
 *   isOpen: false,
 *   isLoading: false,
 * });
 */
export function useMultiToggle<T extends Record<string, boolean>>(
  initialValues: T
): {
  values: T;
  toggle: (key: keyof T) => void;
  set: (key: keyof T, value: boolean) => void;
  reset: () => void;
  setAll: (value: boolean) => void;
} {
  const [values, setValues] = useState<T>(initialValues);
  
  const toggle = useCallback((key: keyof T) => {
    setValues(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);
  
  const set = useCallback((key: keyof T, value: boolean) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);
  
  const setAll = useCallback((value: boolean) => {
    setValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        newValues[key as keyof T] = value as any;
      });
      return newValues;
    });
  }, []);
  
  return { values, toggle, set, reset, setAll };
}
