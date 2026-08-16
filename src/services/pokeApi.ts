import { PokemonListResponse, PokemonDetail, PokemonSpecies } from '@/types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Base fetch function with error handling
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    // Add caching or revalidation strategies here if needed in Next.js
    next: { revalidate: 3600 }, // Cache for 1 hour by default for mostly static data
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Not found');
    }
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch a list of pokemon (names and urls)
 */
export async function getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
  return fetchApi<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
}

/**
 * Fetch detailed information for a specific pokemon by name or ID
 */
export async function getPokemonDetails(nameOrId: string | number): Promise<PokemonDetail> {
  return fetchApi<PokemonDetail>(`/pokemon/${nameOrId}`);
}

/**
 * Fetch species information (for flavor text)
 */
export async function getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  return fetchApi<PokemonSpecies>(`/pokemon-species/${nameOrId}`);
}

/**
 * Fetch a list of all pokemon types
 */
export async function getTypes(): Promise<{ results: { name: string; url: string }[] }> {
  return fetchApi<{ results: { name: string; url: string }[] }>('/type');
}

/**
 * Fetch pokemon belonging to a specific type
 */
export async function getPokemonByType(type: string): Promise<{ pokemon: { pokemon: { name: string; url: string } }[] }> {
  return fetchApi<{ pokemon: { pokemon: { name: string; url: string } }[] }>(`/type/${type}`);
}

/**
 * Helper to extract pokemon ID from url
 */
export function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}
