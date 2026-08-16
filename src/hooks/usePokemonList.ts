import { useState, useCallback, useRef } from 'react';
import { getPokemonList, getPokemonDetails, extractIdFromUrl, getPokemonByType } from '@/services/pokeApi';
import { PokemonBaseData } from '@/types/pokemon';

interface UsePokemonListOptions {
  limit?: number;
}

export function usePokemonList({ limit = 20 }: UsePokemonListOptions = {}) {
  const [pokemon, setPokemon] = useState<PokemonBaseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Track global offset for normal pagination
  const [offset, setOffset] = useState(0);
  
  // Track bounds for current generation
  const boundsRef = useRef({ offset: 0, limit: 1025 });
  
  // For type filtering, we get all pokemon of that type, but only resolve details for the current batch
  const [typeFilteredList, setTypeFilteredList] = useState<{name: string, url: string}[] | null>(null);
  
  // Ref to prevent duplicate concurrent fetches
  const isFetchingRef = useRef(false);

  const fetchPokemonBatch = useCallback(async (
    urlsToFetch: {name: string, url: string}[], 
    isLoadMore: boolean
  ) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const batchDetails = await Promise.all(
        urlsToFetch.map(async (p) => {
          const id = extractIdFromUrl(p.url);
          try {
            // Fetch both detail and species data concurrently
            const [detail, speciesResponse] = await Promise.all([
              getPokemonDetails(id),
              fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.ok ? res.json() : null).catch(() => null)
            ]);
            
            // Extract English genus if available
            let genus = null;
            if (speciesResponse && speciesResponse.genera) {
              const enGenus = speciesResponse.genera.find((g: any) => g.language.name === 'en');
              if (enGenus) {
                genus = enGenus.genus;
              }
            }

            return {
              id: detail.id,
              name: detail.name,
              image: detail.sprites.other?.['official-artwork']?.front_default || detail.sprites.front_default,
              types: detail.types.map(t => t.type.name),
              genus: genus,
              height: detail.height,
              weight: detail.weight,
              baseExp: detail.base_experience,
              stats: {
                hp: detail.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
                attack: detail.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
                speed: detail.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
              }
            };
          } catch (err) {
            console.error(`Failed to fetch details for ${p.name}`, err);
            return null; 
          }
        })
      );

      const validPokemon = batchDetails.filter(Boolean) as PokemonBaseData[];
      
      setPokemon(prev => isLoadMore ? [...prev, ...validPokemon] : validPokemon);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pokemon batch'));
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const loadInitial = useCallback(async (startOffset = 0, maxLimit = 1025) => {
    setIsInitialLoading(true);
    boundsRef.current = { offset: startOffset, limit: maxLimit };
    setOffset(startOffset);
    setTypeFilteredList(null);
    setHasMore(true);
    
    try {
      const fetchLimit = Math.min(limit, maxLimit);
      const response = await getPokemonList(fetchLimit, startOffset);
      setOffset(startOffset + fetchLimit);
      setHasMore(fetchLimit < maxLimit && !!response.next);
      await fetchPokemonBatch(response.results, false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch initial pokemon list'));
      setIsInitialLoading(false);
    }
  }, [limit, fetchPokemonBatch]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || isFetchingRef.current) return;

    if (typeFilteredList) {
      const nextBatch = typeFilteredList.slice(offset, offset + limit);
      if (nextBatch.length > 0) {
        setOffset(prev => prev + limit);
        setHasMore(offset + limit < typeFilteredList.length);
        await fetchPokemonBatch(nextBatch, true);
      } else {
        setHasMore(false);
      }
    } else {
      const currentGenBounds = boundsRef.current;
      const itemsFetchedSoFar = offset - currentGenBounds.offset;
      const remainingInGen = currentGenBounds.limit - itemsFetchedSoFar;
      
      if (remainingInGen <= 0) {
        setHasMore(false);
        return;
      }

      const fetchLimit = Math.min(limit, remainingInGen);
      
      try {
        const response = await getPokemonList(fetchLimit, offset);
        setOffset(prev => prev + fetchLimit);
        setHasMore(fetchLimit < remainingInGen && !!response.next);
        await fetchPokemonBatch(response.results, true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load more pokemon'));
      }
    }
  }, [isLoading, hasMore, offset, limit, typeFilteredList, fetchPokemonBatch]);

  const filterByType = useCallback(async (type: string, startOffset = 0, maxLimit = 1025) => {
    setIsInitialLoading(true);
    setError(null);
    setPokemon([]); 
    boundsRef.current = { offset: startOffset, limit: maxLimit };
    
    if (type === 'all') {
      await loadInitial(startOffset, maxLimit);
      return;
    }

    try {
      const response = await getPokemonByType(type);
      
      // Filter the returned pokemon to only include those in the current generation bounds
      // API returns URLs with IDs. We can check if the ID falls within the gen bounds.
      const minId = startOffset + 1;
      const maxId = startOffset + maxLimit;
      
      const allOfTypeInGen = response.pokemon
        .map(p => p.pokemon)
        .filter(p => {
           const id = extractIdFromUrl(p.url);
           return id >= minId && id <= maxId;
        });
      
      setTypeFilteredList(allOfTypeInGen);
      setOffset(limit);
      setHasMore(allOfTypeInGen.length > limit);
      
      const firstBatch = allOfTypeInGen.slice(0, limit);
      await fetchPokemonBatch(firstBatch, false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch pokemon for type ${type}`));
      setIsInitialLoading(false);
    }
  }, [limit, loadInitial, fetchPokemonBatch]);

  return {
    pokemon,
    isLoading,
    isInitialLoading,
    error,
    hasMore,
    loadMore,
    loadInitial,
    filterByType
  };
}
