"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useCompare } from "@/hooks/useCompare";
import { getPokemonDetails, getPokemonSpecies } from "@/services/pokeApi";
import { PokemonBaseData } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import { capitalize, formatId } from "@/lib/utils";

export default function ComparePage() {
  const { compareIds, removeCompare, isLoaded } = useCompare();
  const [pokemon1, setPokemon1] = useState<PokemonBaseData | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonBaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchCompareData = async () => {
      setIsLoading(true);
      try {
        if (compareIds[0]) {
          const detail1 = await fetchDetail(compareIds[0]);
          setPokemon1(detail1);
        } else {
          setPokemon1(null);
        }

        if (compareIds[1]) {
          const detail2 = await fetchDetail(compareIds[1]);
          setPokemon2(detail2);
        } else {
          setPokemon2(null);
        }
      } catch (err) {
        console.error("Failed to load compare data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompareData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareIds.join(','), isLoaded]);

  const fetchDetail = async (id: number): Promise<PokemonBaseData> => {
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
  };

  const renderStatRow = (label: string, statKey: 'hp' | 'attack' | 'speed', p1: PokemonBaseData | null, p2: PokemonBaseData | null) => {
    const val1 = p1 ? p1.stats[statKey] : 0;
    const val2 = p2 ? p2.stats[statKey] : 0;
    
    const maxVal = Math.max(val1, val2, 1); // Avoid division by zero
    const p1Wins = val1 > val2;
    const p2Wins = val2 > val1;

    return (
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex justify-between text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          <span className={p1Wins ? "text-green-500" : ""}>{val1 || '-'}</span>
          <span>{label}</span>
          <span className={p2Wins ? "text-green-500" : ""}>{val2 || '-'}</span>
        </div>
        <div className="flex w-full h-3 bg-[var(--elevated-card)] rounded-full overflow-hidden">
          {/* Left Bar (P1) */}
          <div className="w-1/2 flex justify-end border-r border-[var(--primary-bg)]">
            {p1 && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(val1 / 255) * 100}%` }}
                className={`h-full ${p1Wins ? 'bg-green-500' : 'bg-[var(--accent-primary)]'}`}
              />
            )}
          </div>
          {/* Right Bar (P2) */}
          <div className="w-1/2 flex justify-start">
            {p2 && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(val2 / 255) * 100}%` }}
                className={`h-full ${p2Wins ? 'bg-green-500' : 'bg-[#8A72FF]'}`}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPokemonCard = (pokemon: PokemonBaseData | null, index: number) => {
    if (!pokemon) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 min-h-[300px]">
          <p className="text-[var(--text-muted)] font-medium mb-4 text-center">Select another Pokémon to compare</p>
          <Link href="/" className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-xl font-bold hover:opacity-90">
            Explore
          </Link>
        </div>
      );
    }

    return (
      <div className="flex-1 relative flex flex-col items-center p-6 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl shadow-xl">
        <button 
          onClick={() => removeCompare(pokemon.id)}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          aria-label={`Remove ${pokemon.name}`}
        >
          <X size={20} />
        </button>
        <div className="w-48 h-48 relative mb-6">
          {pokemon.image && (
            <Image 
              src={pokemon.image} 
              alt={pokemon.name} 
              fill 
              sizes="(max-width: 768px) 192px, 192px"
              className="object-contain drop-shadow-2xl" 
            />
          )}
        </div>
        <span className="text-[var(--text-secondary)] font-bold tracking-widest">{formatId(pokemon.id)}</span>
        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] capitalize mb-2">{pokemon.name}</h2>
        <span className="text-xs font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase mb-4">{pokemon.genus || 'POKÉMON'}</span>
        
        <div className="flex gap-4 mt-2 w-full justify-center">
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Height</p>
            <p className="text-white font-medium">{pokemon.height / 10}m</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Weight</p>
            <p className="text-white font-medium">{pokemon.weight / 10}kg</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8 group focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] rounded-lg"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Explorer</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-10 text-center">
          Head to Head
        </h1>

        {!isLoaded || isLoading ? (
          <div className="flex flex-col gap-12 w-full animate-pulse mt-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl h-[400px]"></div>
              <div className="w-16 h-16 rounded-full bg-[var(--border-subtle)] shrink-0 hidden md:block"></div>
              <div className="flex-1 w-full bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl h-[400px]"></div>
            </div>
            <div className="w-full bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl h-[300px]"></div>
          </div>
        ) : compareIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl p-12 text-center shadow-xl">
            <div className="w-20 h-20 bg-[var(--elevated-card)] rounded-full flex items-center justify-center mb-6">
              <span className="text-[var(--text-muted)] font-black text-2xl italic">VS</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Nothing to compare</h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md">
              You haven't selected any Pokémon to compare. Go back to the explorer and click the scale icon on any Pokémon card to add them here.
            </p>
            <Link href="/" className="px-8 py-3 bg-[var(--accent-primary)] text-white rounded-xl font-bold hover:opacity-90 shadow-lg hover:shadow-[var(--accent-primary)]/20 transition-all">
              Explore Pokémon
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {/* Top row: Cards */}
            <div className="flex flex-col md:flex-row gap-6 relative">
              <div className="flex-1">{renderPokemonCard(pokemon1, 0)}</div>
              
              {/* VS Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary-bg)] border-4 border-[var(--card-bg)] shadow-xl">
                <span className="font-black text-xl italic text-[var(--accent-primary)]">VS</span>
              </div>

              <div className="flex-1">{renderPokemonCard(pokemon2, 1)}</div>
            </div>

            {/* Bottom row: Stats */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl p-8 md:p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-10">Battle Statistics</h3>
              {renderStatRow("HP", "hp", pokemon1, pokemon2)}
              {renderStatRow("Attack", "attack", pokemon1, pokemon2)}
              {renderStatRow("Speed", "speed", pokemon1, pokemon2)}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
