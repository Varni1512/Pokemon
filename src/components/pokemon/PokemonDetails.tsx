"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Scale, Ruler, Weight, Award, Leaf, Skull, Flame, Droplet, Bug, Circle, Zap, Mountain, Sparkles, Sword, Eye, Gem, Ghost, Snowflake, Moon, Shield, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { PokemonDetail, PokemonSpecies } from "@/types/pokemon";
import { TYPE_COLORS } from "@/constants/pokemonTypes";
import { formatId, cn } from "@/lib/utils";
import { FavoriteButton } from "../ui/FavoriteButton";
import { StatBar } from "../ui/StatBar";
import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";

interface PokemonDetailsProps {
  pokemon: PokemonDetail;
  species: PokemonSpecies | null;
}

const getTypeIcon = (type: string) => {
  switch(type.toLowerCase()) {
    case 'grass': return <Leaf size={14} />;
    case 'fire': return <Flame size={14} />;
    case 'water': return <Droplet size={14} />;
    case 'bug': return <Bug size={14} />;
    case 'normal': return <Circle size={14} />;
    case 'electric': return <Zap size={14} />;
    case 'ground': return <Mountain size={14} />;
    case 'fairy': return <Sparkles size={14} />;
    case 'fighting': return <Sword size={14} />;
    case 'psychic': return <Eye size={14} />;
    case 'poison': return <Skull size={14} />;
    case 'rock': return <Gem size={14} />;
    case 'ghost': return <Ghost size={14} />;
    case 'ice': return <Snowflake size={14} />;
    case 'dragon': return <Flame size={14} />;
    case 'dark': return <Moon size={14} />;
    case 'steel': return <Shield size={14} />;
    case 'flying': return <Wind size={14} />;
    default: return <Circle size={14} />;
  }
};

export function PokemonDetails({ pokemon, species }: PokemonDetailsProps) {
  const [showAllMoves, setShowAllMoves] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toggleCompare, isComparing } = useCompare();
  
  const primaryType = pokemon.types[0]?.type.name.toLowerCase();
  const glowColor = TYPE_COLORS[primaryType] || "var(--border-subtle)";
  const comparing = isComparing(pokemon.id);

  const flavorText = species?.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  )?.flavor_text.replace(/\f|\n|\r/g, " ");

  const image = pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default;

  return (
    <div className="w-full relative min-h-screen">
      {/* Background radial glow */}
      <div 
        className="fixed inset-0 opacity-10 dark:opacity-20 pointer-events-none transition-colors duration-1000 -z-10"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${glowColor} 0%, transparent 60%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 dark:text-[var(--text-secondary)] hover:text-black dark:hover:text-white transition-colors mb-8 group focus:outline-none rounded-lg"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-sm">Back to Explorer</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Column - Image Container */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[40%] flex flex-col items-center justify-start"
          >
            <div className="group relative w-full aspect-square flex items-center justify-center bg-white dark:bg-[#0E0F18] rounded-[30px] border border-[var(--border-subtle)] shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] p-12 overflow-hidden">
              {/* Premium Top Center Glow Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#8A72FF] to-transparent opacity-40 dark:opacity-80 z-30 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[5px] bg-gradient-to-r from-transparent via-[#8A72FF] to-transparent opacity-20 dark:opacity-40 blur-sm z-30 pointer-events-none" />
              
              {/* Radial Gradient Background Spotlight */}
              <div
                className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-80"
                style={{ background: 'radial-gradient(circle at 50% 20%, #2e2640 0%, transparent 60%)' }}
              />

              <div className="relative w-full h-full z-10">
                {image ? (
                  <Image
                    src={image}
                    alt={pokemon.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-[var(--text-muted)] font-medium">
                    No Image Available
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <div className="w-full lg:w-[55%] flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xl md:text-2xl font-sans font-medium text-gray-500 dark:text-[var(--text-secondary)] tracking-wider">
                  {formatId(pokemon.id)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(pokemon.id)}
                    className="cursor-pointer z-30 transition-transform hover:scale-110 p-3 focus:outline-none rounded-full bg-white dark:bg-[#0E0F18] border border-[var(--border-subtle)] shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                    aria-label={`Add ${pokemon.name} to comparison`}
                    title={`Compare ${pokemon.name}`}
                  >
                    <Scale size={20} className={comparing ? "text-[var(--accent-primary)]" : "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors"} />
                  </button>
                  <FavoriteButton 
                    isFavorite={isFavorite(pokemon.id)} 
                    onClick={() => toggleFavorite(pokemon.id)} 
                    size={28}
                    className={cn(
                      "cursor-pointer z-30 transition-transform hover:scale-110 p-3 rounded-full border border-[var(--border-subtle)] bg-white dark:bg-[#0E0F18] shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)]",
                      isFavorite(pokemon.id) ? "text-[#FF3B30]" : "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors"
                    )}
                  />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-5xl font-bold text-black dark:text-[var(--text-primary)] capitalize leading-tight mb-2">
                {pokemon.name}
              </h1>

              <span className="block text-[14px] font-bold text-gray-500 dark:text-[var(--text-secondary)] tracking-[0.2em] uppercase mb-6">
                {species?.genera.find(g => g.language.name === 'en')?.genus || `${pokemon.types[0]?.type.name} POKÉMON`}
              </span>

              <div className="flex flex-wrap gap-3 mb-8">
                {pokemon.types.map((t) => {
                  const typeName = t.type.name;
                  const typeColor = TYPE_COLORS[typeName.toLowerCase()] || "var(--text-muted)";
                  return (
                    <span
                      key={typeName}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-[#151823] text-black dark:text-white shadow-sm"
                      style={{ border: `1px solid ${typeColor}` }}
                    >
                      {getTypeIcon(typeName)}
                      {typeName}
                    </span>
                  );
                })}
              </div>

              {flavorText && (
                <p className="text-lg md:text-xl text-gray-600 dark:text-[var(--text-secondary)] leading-relaxed max-w-2xl font-medium">
                  {flavorText}
                </p>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-between items-center w-full px-6 md:px-10 py-6 md:py-5 bg-white dark:bg-[#0E0F18] rounded-2xl border border-[var(--border-subtle)] shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)]"
            >
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-1 justify-center">
                <Ruler className="text-[#8A72FF] -rotate-45" size={32} strokeWidth={2} />
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-black dark:text-white font-medium text-xl md:text-2xl leading-none">{pokemon.height / 10} m</span>
                  <span className="text-[11px] md:text-[12px] text-gray-500 dark:text-[var(--text-muted)] font-bold tracking-widest uppercase leading-none">Height</span>
                </div>
              </div>
              
              <div className="w-[1px] h-12 md:h-16 bg-black/10 dark:bg-white/10" />

              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-1 justify-center">
                <Weight className="text-[#8A72FF]" size={32} strokeWidth={2} />
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-black dark:text-white font-medium text-xl md:text-2xl leading-none">{pokemon.weight / 10} kg</span>
                  <span className="text-[11px] md:text-[12px] text-gray-500 dark:text-[var(--text-muted)] font-bold tracking-widest uppercase leading-none">Weight</span>
                </div>
              </div>

              <div className="w-[1px] h-12 md:h-16 bg-black/10 dark:bg-white/10" />
              
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-1 justify-center">
                <Award className="text-[#8A72FF]" size={32} strokeWidth={2} />
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-black dark:text-white font-medium text-xl md:text-2xl leading-none">{pokemon.base_experience}</span>
                  <span className="text-[11px] md:text-[12px] text-gray-500 dark:text-[var(--text-muted)] font-bold tracking-widest uppercase leading-none">Base Exp</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-[#0E0F18] shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-[var(--text-primary)] mb-8">Base Statistics</h2>
              <div className="flex flex-col gap-5">
                {pokemon.stats.map((s) => {
                  let statLabel = s.stat.name;
                  if (statLabel === 'special-attack') statLabel = 'Sp. Atk';
                  if (statLabel === 'special-defense') statLabel = 'Sp. Def';
                  
                  return (
                    <StatBar 
                      key={s.stat.name}
                      label={statLabel}
                      value={s.base_stat}
                      color={glowColor}
                    />
                  );
                })}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col md:flex-row gap-6 mb-12 items-start"
            >
              <div className="flex-1 w-full bg-white dark:bg-[#0E0F18] shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] border border-[var(--border-subtle)] rounded-2xl p-5">
                <h3 className="text-xl font-bold text-black dark:text-[var(--text-primary)] mb-6">Abilities</h3>
                <div className="flex flex-col gap-4">
                  {pokemon.abilities.map((a) => (
                    <div key={a.ability.name} className="flex justify-between items-center bg-gray-50 dark:bg-[var(--elevated-card)] p-3 rounded-xl border border-[var(--border-subtle)]">
                      <span className="font-bold text-black dark:text-[var(--text-primary)] capitalize">
                        {a.ability.name.replace('-', ' ')}
                      </span>
                      {a.is_hidden && (
                        <span className="text-[11px] bg-[var(--accent-primary)]/10 dark:bg-[var(--accent-primary)]/20 text-[#DC2626] dark:text-[var(--accent-highlight)] px-3 py-1.5 rounded-md font-bold uppercase tracking-wider">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full bg-white dark:bg-[#0E0F18] shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-black dark:text-[var(--text-primary)]">Moves List</h3>
                  <span className="text-xs font-bold text-gray-400 dark:text-[var(--text-muted)] bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-md uppercase tracking-wider">
                    {pokemon.moves.length} Moves
                  </span>
                </div>
                
                <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-2 hide-scrollbar">
                  {(showAllMoves ? pokemon.moves : pokemon.moves.slice(0, 12)).map((m) => (
                    <div 
                      key={m.move.name}
                      className="flex items-center bg-gray-50 dark:bg-[var(--elevated-card)] p-3 rounded-xl border border-[var(--border-subtle)] hover:border-[#8A72FF]/50 transition-colors"
                    >
                      <span className="font-bold text-black dark:text-[var(--text-primary)] capitalize">
                        {m.move.name.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>

                {pokemon.moves.length > 12 && (
                  <div className="pt-6 mt-auto">
                    <button 
                      onClick={() => setShowAllMoves(!showAllMoves)}
                      className="w-full py-3 bg-gray-50 hover:bg-gray-100 dark:bg-[var(--elevated-card)] dark:hover:bg-white/5 border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-black dark:text-[var(--text-primary)] transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      {showAllMoves ? "Show Less" : `View All ${pokemon.moves.length} Moves`}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
