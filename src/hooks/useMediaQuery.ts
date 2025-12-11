import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants';

/**
 * Media Query Hook
 * Tracks whether a media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Responsive Hook
 * Returns boolean flags for common breakpoints
 */
export function useResponsive() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.SM - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${BREAKPOINTS.SM}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);
  const isLargeDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.XL}px)`);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTouchDevice: isMobile || isTablet,
  };
}
