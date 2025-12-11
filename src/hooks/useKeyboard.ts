import { useEffect, useCallback } from 'react';

/**
 * Keyboard Shortcut Configuration
 */
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

/**
 * Keyboard Shortcuts Map
 */
export type KeyboardShortcutsMap = Record<string, () => void>;

/**
 * Keyboard Shortcuts Hook
 * Registers global keyboard shortcuts
 * 
 * @example
 * useKeyboard({
 *   'ArrowRight': () => nextQuestion(),
 *   'ArrowLeft': () => previousQuestion(),
 *   'Escape': () => closeModal(),
 *   'KeyK': () => openSearch(), // requires Ctrl/Cmd
 * });
 */
export function useKeyboard(shortcuts: KeyboardShortcutsMap) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      const code = event.code;
      
      // Check if shortcut exists for this key or code
      const shortcutKey = shortcuts[key] ? key : shortcuts[code] ? code : null;
      
      if (shortcutKey && shortcuts[shortcutKey]) {
        // Prevent default browser behavior for custom shortcuts
        event.preventDefault();
        shortcuts[shortcutKey]();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Advanced Keyboard Hook with Modifier Keys
 * 
 * @example
 * useAdvancedKeyboard([
 *   {
 *     key: 'k',
 *     ctrlKey: true,
 *     callback: () => openSearch(),
 *   },
 *   {
 *     key: 'Escape',
 *     callback: () => closeModal(),
 *   },
 * ]);
 */
interface KeyboardShortcutWithModifiers {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
}

export function useAdvancedKeyboard(shortcuts: KeyboardShortcutWithModifiers[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = 
          event.key.toLowerCase() === shortcut.key.toLowerCase() ||
          event.code === shortcut.key;
        
        const modifiersMatch =
          (shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey) &&
          (shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey) &&
          (shortcut.altKey === undefined || event.altKey === shortcut.altKey) &&
          (shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey);
        
        if (keyMatches && modifiersMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook for handling keyboard navigation in lists
 * 
 * @example
 * const { selectedIndex, handleKeyDown } = useListKeyboard({
 *   items: platforms,
 *   onSelect: (platform) => selectPlatform(platform),
 * });
 */
interface UseListKeyboardOptions<T> {
  items: T[];
  onSelect?: (item: T) => void;
  onEscape?: () => void;
  loop?: boolean; // Whether to loop from end to start
}

export function useListKeyboard<T>({
  items,
  onSelect,
  onEscape,
  loop = true,
}: UseListKeyboardOptions<T>) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = prev + 1;
            if (next >= items.length) {
              return loop ? 0 : prev;
            }
            return next;
          });
          break;

        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = prev - 1;
            if (next < 0) {
              return loop ? items.length - 1 : 0;
            }
            return next;
          });
          break;

        case 'Enter':
          event.preventDefault();
          if (onSelect && items[selectedIndex]) {
            onSelect(items[selectedIndex]);
          }
          break;

        case 'Escape':
          event.preventDefault();
          if (onEscape) {
            onEscape();
          }
          break;
      }
    },
    [items, selectedIndex, onSelect, onEscape, loop]
  );

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  };
}

/**
 * Hook for Konami Code easter egg
 * 
 * @example
 * useKonamiCode(() => {
 *   console.log('Konami Code activated!');
 * });
 */
export function useKonamiCode(callback: () => void) {
  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ];

  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = [...prev, event.code];
        
        // Keep only last 10 keys
        if (newKeys.length > konamiCode.length) {
          newKeys.shift();
        }
        
        // Check if matches Konami Code
        if (newKeys.length === konamiCode.length) {
          const matches = newKeys.every((key, index) => key === konamiCode[index]);
          if (matches) {
            callback();
            return [];
          }
        }
        
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}

// Import useState for useListKeyboard
import { useState } from 'react';
