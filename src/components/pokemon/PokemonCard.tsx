"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FavoriteButton } from '../ui/FavoriteButton';
import { formatId, cn } from '@/lib/utils';
import { PokemonBaseData } from '@/types/pokemon';
import { TYPE_COLORS } from '@/constants/pokemonTypes';
import {
  Leaf, Skull, Flame, Droplet, Bug, Circle, Zap, Mountain, Sparkles,
  Sword, Eye, Gem, Ghost, Snowflake, Moon, Shield, Wind, Scale,
  Ruler, Weight, Award
} from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';

interface PokemonCardProps {
  pokemon: PokemonBaseData;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  index: number;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'grass': return <Leaf size={12} />;
    case 'poison': return <Skull size={12} />;
    case 'fire': return <Flame size={12} />;
    case 'water': return <Droplet size={12} />;
    case 'bug': return <Bug size={12} />;
    case 'normal': return <Circle size={12} />;
    case 'electric': return <Zap size={12} />;
    case 'ground': return <Mountain size={12} />;
    case 'fairy': return <Sparkles size={12} />;
    case 'fighting': return <Sword size={12} />;
    case 'psychic': return <Eye size={12} />;
    case 'rock': return <Gem size={12} />;
    case 'ghost': return <Ghost size={12} />;
    case 'ice': return <Snowflake size={12} />;
    case 'dragon': return <Flame size={12} />; // fallback
    case 'dark': return <Moon size={12} />;
    case 'steel': return <Shield size={12} />;
    case 'flying': return <Wind size={12} />;
    default: return <Circle size={12} />;
  }
};

export function PokemonCard({ pokemon, isFavorite, onToggleFavorite, index }: PokemonCardProps) {
  const { toggleCompare, isComparing } = useCompare();
  const comparing = isComparing(pokemon.id);

  return (
    <div
      className="group relative rounded-[28px] flex flex-col min-h-[420px] transition-transform duration-300 hover:-translate-y-1 overflow-hidden bg-white dark:bg-[#0E0F18] shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)]"
    >
      {/* Premium Top Center Glow Line (Thick in center, fading to corners) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#8A72FF] to-transparent opacity-40 dark:opacity-80 z-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[4px] bg-gradient-to-r from-transparent via-[#8A72FF] to-transparent opacity-20 dark:opacity-40 blur-sm z-30 pointer-events-none" />

      {/* Radial Gradient Background Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 20%, #2e2640 0%, transparent 60%)'
        }}
      />

      {/* Top Header Row (ID and Action Buttons) */}
      <div className="flex justify-between items-start p-6 pb-0 z-20">
        <span className="text-[16px] font-sans font-medium text-gray-500 dark:text-[var(--text-secondary)] tracking-wider">
          {formatId(pokemon.id)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(pokemon.id);
            }}
            className="cursor-pointer z-30 transition-transform hover:scale-110 p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded-full"
            aria-label={`Add ${pokemon.name} to comparison`}
            title={`Compare ${pokemon.name}`}
          >
            <Scale
              size={18}
              strokeWidth={1.5}
              className={comparing ? "text-[var(--accent-primary)]" : "text-black/30 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors"}
            />
          </button>
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(pokemon.id);
            }}
            size={24}
            strokeWidth={1.5}
            className={cn(
              "cursor-pointer z-30 transition-transform hover:scale-110",
              isFavorite ? "text-[#FF3B30]" : "text-black/30 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors"
            )}
          />
        </div>
      </div>

      <Link href={`/pokemon/${pokemon.name}`} className="flex-1 flex flex-col px-6 pb-6 z-10 relative">

        {/* Center Image */}
        <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center mb-4">
          {pokemon.image ? (
            <div className="relative w-full h-full max-h-[200px]">
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500"
                priority={pokemon.id <= 20}
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full animate-pulse" />
          )}
        </div>

        {/* Bottom Details - Left Aligned */}
        <div className="flex flex-col items-start w-full">
          <h2 className="text-[28px] font-bold text-black dark:text-[var(--text-primary)] capitalize leading-tight mb-1">
            {pokemon.name}
          </h2>
          <span className="text-[12px] font-bold text-gray-500 dark:text-[var(--text-secondary)] tracking-[0.15em] uppercase mb-4">
            {pokemon.genus || `${pokemon.types[0]} POKÉMON`}
          </span>

          <div className="flex flex-wrap gap-2.5 mb-5">
            {pokemon.types.map((type) => {
              const color = TYPE_COLORS[type] || 'var(--text-muted)';
              return (
                <span
                  key={type}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-[#151823] text-black dark:text-white"
                  style={{
                    border: `1px solid ${color}`
                  }}
                >
                  {getTypeIcon(type)}
                  {type}
                </span>
              );
            })}
          </div>

          {/* Separator */}
          <div className="w-full h-[1px] bg-black/10 dark:bg-white/10 mb-5" />

          {/* Bottom Stats */}
          <div className="flex justify-between items-center w-full px-1 ">
            <div className="flex items-center gap-3">
              <Ruler className="text-[#8A72FF] -rotate-45" size={20} strokeWidth={2} />
              <div className="flex flex-col gap-1">
                <span className="text-black dark:text-white font-medium text-sm leading-none">{pokemon.height / 10} m</span>
                <span className="text-[10px] text-gray-500 dark:text-[var(--text-muted)] font-bold tracking-widest uppercase leading-none">Height</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Weight className="text-[#8A72FF]" size={20} strokeWidth={2} />
              <div className="flex flex-col gap-1">
                <span className="text-black dark:text-white font-medium text-sm leading-none">{pokemon.weight / 10} kg</span>
                <span className="text-[10px] text-gray-500 dark:text-[var(--text-muted)] font-bold tracking-widest uppercase leading-none">Weight</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="text-[#8A72FF]" size={20} strokeWidth={2} />
              <div className="flex flex-col gap-1">
                <span className="text-black dark:text-white font-medium text-sm leading-none">{pokemon.baseExp}</span>
                <span className="text-[10px] text-gray-500 dark:text-[var(--text-muted)] font-bold tracking-widest uppercase leading-none">Base Exp</span>
              </div>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}