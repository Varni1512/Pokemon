"use client";

import { PokemonCard } from './PokemonCard';
import { PokemonSkeleton } from '../ui/SkeletonCard';
import { PokemonBaseData } from '@/types/pokemon';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';

interface PokemonGridProps {
  pokemon: PokemonBaseData[];
  isLoading: boolean;
  isInitialLoading?: boolean;
}

export function PokemonGrid({ pokemon, isLoading, isInitialLoading }: PokemonGridProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  // If favorites aren't loaded yet from local storage or initial load is happening
  if (!isLoaded || isInitialLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <PokemonSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (pokemon.length === 0 && !isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-24">
        <p className="text-[var(--text-muted)] text-lg">No Pokémon found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {pokemon.map((p, index) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            index={index}
            isFavorite={isFavorite(p.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </motion.div>
      
      {/* Show skeletons at the bottom when loading more */}
      {isLoading && pokemon.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <PokemonSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
