/**
 * Hooks Barrel Export
 * Centralized export for all custom hooks
 * 
 * @module hooks
 */

// Storage hooks
export * from './useLocalStorage';

// Analytics hooks
export * from './useAnalytics';

// Performance hooks
export * from './useDebounce';

// Responsive hooks
export * from './useMediaQuery';

// Interaction hooks
export * from './useKeyboard';
export * from './useClickOutside';

// State hooks
export * from './usePrevious';
export * from './useToggle';
export * from './useAsync';

// Context hooks
export { useToast } from '../contexts/ToastContext';
export * from './useEventToasts';