import { useEffect, RefObject } from 'react';

/**
 * Click Outside Hook
 * Detects clicks outside of a referenced element
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setIsOpen(false));
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;
    
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      
      // Do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}

/**
 * Click Outside with Multiple Refs
 * 
 * @example
 * useClickOutsideMultiple([ref1, ref2], () => setIsOpen(false));
 */
export function useClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;
    
    const listener = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside ALL refs
      const clickedOutsideAll = refs.every(ref => {
        const element = ref.current;
        return !element || !element.contains(event.target as Node);
      });
      
      if (clickedOutsideAll) {
        handler(event);
      }
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, handler, enabled]);
}
