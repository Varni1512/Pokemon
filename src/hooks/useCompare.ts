import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';

const COMPARE_KEY = 'pokedex_compare';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('compare-updated', callback);
  return () => window.removeEventListener('compare-updated', callback);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem(COMPARE_KEY) || '[]';
};

const getServerSnapshot = () => '[]';

export function useCompare() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const compareIds: number[] = useMemo(() => JSON.parse(store), [store]);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const addCompare = useCallback((id: number) => {
    const current: number[] = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
    if (current.includes(id)) return;
    if (current.length >= 2) return;
    
    const newIds = [...current, id];
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new Event('compare-updated'));
    } catch (error) {}
  }, []);

  const removeCompare = useCallback((id: number) => {
    const current: number[] = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
    const newIds = current.filter(compareId => compareId !== id);
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new Event('compare-updated'));
    } catch (error) {}
  }, []);

  const toggleCompare = useCallback((id: number) => {
    const current: number[] = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
    let newIds = current;
    
    if (current.includes(id)) {
      newIds = current.filter(compareId => compareId !== id);
    } else {
      if (current.length >= 2) return;
      newIds = [...current, id];
    }
    
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new Event('compare-updated'));
    } catch (error) {}
  }, []);

  const clearCompare = useCallback(() => {
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
      window.dispatchEvent(new Event('compare-updated'));
    } catch (error) {}
  }, []);

  const isComparing = useCallback((id: number) => compareIds.includes(id), [compareIds]);

  return {
    compareIds,
    addCompare,
    removeCompare,
    toggleCompare,
    clearCompare,
    isComparing,
    isLoaded,
    canAddMore: compareIds.length < 2
  };
}
