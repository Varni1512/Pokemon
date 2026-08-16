"use client";

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/pokemon/SearchBar';
import { TypeFilter } from '@/components/pokemon/TypeFilter';
import { GenerationFilter } from '@/components/pokemon/GenerationFilter';
import { SortFilter, SortOption } from '@/components/pokemon/SortFilter';
import { PokemonGrid } from '@/components/pokemon/PokemonGrid';
import { LoadMoreButton } from '@/components/ui/LoadMoreButton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useFavorites } from '@/hooks/useFavorites';
import { getPokemonDetails } from '@/services/pokeApi';
import { PokemonBaseData } from '@/types/pokemon';
import { GENERATIONS } from '@/constants/pokemonTypes';

let globalPokemonList: {name: string, url: string}[] | null = null;

const getGlobalList = async () => {
  if (globalPokemonList) return globalPokemonList;
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
    if (res.ok) {
      const data = await res.json();
      globalPokemonList = data.results;
      return globalPokemonList;
    }
  } catch (e) {
    console.error("Failed to fetch global list");
  }
  return null;
}

function ExplorerContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const isFavoritesView = view === 'favorites';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGen, setSelectedGen] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('id_asc');
  
  // Calculate limit/offset based on selected generation
  const activeGen = GENERATIONS.find(g => g.id === selectedGen);
  
  const {
    pokemon,
    isLoading,
    isInitialLoading,
    error,
    hasMore,
    loadMore,
    loadInitial,
    filterByType
  } = usePokemonList({ limit: 20 });

  const { favorites, isLoaded: favoritesLoaded } = useFavorites();
  const [favoriteDetails, setFavoriteDetails] = useState<PokemonBaseData[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

  const [searchedPokemon, setSearchedPokemon] = useState<PokemonBaseData[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  // State for favorites view
  useEffect(() => {
    setIsFavoritesLoading(true);
  }, [isFavoritesView]);

  // Load initial generic list
  useEffect(() => {
    // Only load initial if not in favorites view and no search is active
    if (!isFavoritesView && !searchQuery) {
      if (selectedType === 'all') {
        loadInitial(activeGen?.offset, activeGen?.limit);
      } else {
        filterByType(selectedType, activeGen?.offset, activeGen?.limit);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedGen, isFavoritesView, searchQuery]);

  // Fetch favorite details when entering favorites view
  useEffect(() => {
    if (isFavoritesView && favoritesLoaded && favorites.length > 0) {
      setIsFavoritesLoading(true);
      const fetchFavorites = async () => {
        try {
          const details = await Promise.all(
            favorites.map(async (id) => {
              const [detail, speciesResponse] = await Promise.all([
                getPokemonDetails(id),
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.ok ? res.json() : null).catch(() => null)
              ]);
              
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
            })
          );
          setFavoriteDetails(details.filter(Boolean) as PokemonBaseData[]);
        } catch (err) {
          console.error("Failed to load favorites details");
        } finally {
          setIsFavoritesLoading(false);
        }
      };
      fetchFavorites();
    } else if (isFavoritesView && favorites.length === 0) {
      setFavoriteDetails([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFavoritesView, favoritesLoaded, favorites.join(',')]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSearchError(false);
    
    if (!query) {
      setSearchedPokemon(null);
      return;
    }

    setIsSearching(true);
    try {
      const allPokemon = await getGlobalList();
      if (!allPokemon) throw new Error("Failed to get list");

      const isId = /^\d+$/.test(query);
      let matches = [];
      
      if (isId) {
        matches = allPokemon.filter((p: any) => {
          const urlParts = p.url.split('/').filter(Boolean);
          const id = urlParts[urlParts.length - 1];
          return id === query;
        });
      } else {
        matches = allPokemon.filter((p: any) => p.name.includes(query.toLowerCase()));
      }

      if (matches.length === 0) {
        setSearchedPokemon([]);
        setSearchError(true);
        setIsSearching(false);
        return;
      }

      const topMatches = matches.slice(0, 20);

      const batchDetails = await Promise.all(
        topMatches.map(async (p: any) => {
          const urlParts = p.url.split('/').filter(Boolean);
          const id = urlParts[urlParts.length - 1];
          
          try {
            const [detail, speciesResponse] = await Promise.all([
              getPokemonDetails(id),
              fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.ok ? res.json() : null).catch(() => null)
            ]);
            
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
              types: detail.types.map((t: any) => t.type.name),
              genus: genus,
              height: detail.height,
              weight: detail.weight,
              baseExp: detail.base_experience,
              stats: {
                hp: detail.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
                attack: detail.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0,
                speed: detail.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0,
              }
            };
          } catch (e) {
            return null;
          }
        })
      );

      const validDetails = batchDetails.filter(Boolean) as PokemonBaseData[];
      if (validDetails.length === 0) throw new Error("No details found");
      
      setSearchedPokemon(validDetails);
    } catch (err) {
      setSearchedPokemon([]);
      setSearchError(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSearchQuery('');
    setSearchedPokemon(null);
    setSearchError(false);
  };

  const handleGenSelect = (gen: string) => {
    setSelectedGen(gen);
    setSearchQuery('');
    setSearchedPokemon(null);
    setSearchError(false);
  };

  // Determine which list to display and sort it
  const displayList = useMemo(() => {
    let list = pokemon;

    if (searchQuery) {
      list = searchedPokemon || pokemon;
    } else if (isFavoritesView) {
      list = favoriteDetails;
    }

    // Apply sorting
    if (sortBy) {
      list = [...list].sort((a, b) => {
        switch (sortBy) {
          case 'id_asc': return a.id - b.id;
          case 'id_desc': return b.id - a.id;
          case 'name_asc': return a.name.localeCompare(b.name);
          case 'name_desc': return b.name.localeCompare(a.name);
          case 'hp_desc': return (b.stats?.hp || 0) - (a.stats?.hp || 0);
          case 'attack_desc': return (b.stats?.attack || 0) - (a.stats?.attack || 0);
          case 'speed_desc': return (b.stats?.speed || 0) - (a.stats?.speed || 0);
          default: return a.id - b.id;
        }
      });
    }

    return list;
  }, [pokemon, searchedPokemon, searchQuery, isFavoritesView, favoriteDetails, sortBy]);

  // View logic
  const isListLoading = isFavoritesView ? isFavoritesLoading : isInitialLoading;
  const showLoadMore = !isFavoritesView && !searchQuery && hasMore && selectedType === 'all';

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Hero Section */}
        {!isFavoritesView && (
          <div className="flex flex-col gap-3 py-6 md:py-10 mb-6 border-b border-[var(--border-subtle)]">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Explore the Pokémon world.
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
              Discover Pokémon, explore their types, abilities, stats, and moves.
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm font-bold text-[var(--text-muted)]">
              <span>1025 Pokémon</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)]" />
              <span>18 Types</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)]" />
              <span>9 Generations</span>
            </div>
          </div>
        )}

        {/* Controls Section */}
        {!isFavoritesView && (
          <div className="flex flex-col gap-6 mb-8">
            <div className="w-full">
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>
            
            {!searchQuery && (
              <div className="flex flex-col bg-[var(--elevated-card)] rounded-2xl p-4 md:p-6 border border-[var(--border-subtle)] shadow-xl z-30">
                
                {/* Generation Filter */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 pb-5 border-b border-white/5">
                  <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider min-w-[100px] shrink-0">
                    Generation
                  </span>
                  <div className="flex-1 min-w-0 w-full relative">
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--elevated-card)] to-transparent z-10 pointer-events-none" />
                    <GenerationFilter 
                      selectedGen={selectedGen} 
                      onSelectGen={handleGenSelect} 
                      isLoading={isInitialLoading}
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 pt-5">
                  <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider min-w-[100px] shrink-0">
                    Type
                  </span>
                  <div className="flex-1 min-w-0 w-full relative">
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--elevated-card)] to-transparent z-10 pointer-events-none" />
                    <TypeFilter 
                      selectedType={selectedType} 
                      onSelectType={handleTypeSelect} 
                      isLoading={isInitialLoading}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Results Header */}
            {!isListLoading && displayList.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mt-4 border-t border-[var(--border-subtle)]">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Pokémon</h2>
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">
                    Showing {displayList.length} {searchQuery || selectedType !== 'all' ? 'results' : 'of 1025'}
                  </span>
                </div>
                <SortFilter sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            )}
          </div>
        )}

        {isFavoritesView && (
          <div className="mb-10 py-6 md:py-10 border-b border-[var(--border-subtle)]">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4">
              Favorites
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              You have {favorites.length} favorite Pokémon.
            </p>
          </div>
        )}

        {/* Content Area */}
        {error && !searchError ? (
          <ErrorState onRetry={() => selectedType === 'all' ? loadInitial(activeGen?.offset, activeGen?.limit) : filterByType(selectedType, activeGen?.offset, activeGen?.limit)} />
        ) : searchError ? (
          <EmptyState 
            title="No Pokémon Found"
            description={`We couldn't find any Pokémon matching "${searchQuery}".`}
            action={
              <button onClick={() => handleSearch('')} className="px-6 py-2.5 bg-[var(--accent-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                Clear Search
              </button>
            }
          />
        ) : isFavoritesView && favorites.length === 0 ? (
           <EmptyState 
            title="No favorites yet"
            description="Save Pokémon you love by clicking the heart icon on their cards."
            action={
              <a href="/" className="px-6 py-2.5 bg-[var(--accent-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity mt-4 inline-block">
                Explore Pokémon
              </a>
            }
          />
        ) : (
          <>
            <PokemonGrid 
              pokemon={displayList} 
              isLoading={isLoading} 
              isInitialLoading={isListLoading} 
            />
            {showLoadMore && (
              <div className="mt-12 flex justify-center">
                <LoadMoreButton 
                  onClick={loadMore} 
                  isLoading={isLoading} 
                  hasMore={hasMore} 
                />
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}
