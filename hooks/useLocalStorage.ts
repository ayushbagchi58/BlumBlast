import { useState, useEffect } from "react";

/**
 * Custom hook for managing localStorage with React state.
 * SSR-safe: always returns initialValue on server, syncs with localStorage on client after mount.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Always start with initialValue (consistent server/client first render)
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // After mount, sync with localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
