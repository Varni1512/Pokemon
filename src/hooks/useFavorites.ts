import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';

const FAVORITES_KEY = 'pokemon-favorites';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('favorites-updated', callback);
  return () => window.removeEventListener('favorites-updated', callback);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem(FAVORITES_KEY) || '[]';
};

const getServerSnapshot = () => '[]';

export function useFavorites() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const favorites: number[] = useMemo(() => JSON.parse(store), [store]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    const currentFavorites: number[] = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    const newFavorites = currentFavorites.includes(id) 
      ? currentFavorites.filter((favId) => favId !== id)
      : [...currentFavorites, id];
    
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (error) {
      console.error('Failed to save favorites', error);
    }
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
