"use client";

import { GENERATIONS } from '@/constants/pokemonTypes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GenerationFilterProps {
  selectedGen: string;
  onSelectGen: (gen: string) => void;
  isLoading?: boolean;
}

export function GenerationFilter({ selectedGen, onSelectGen, isLoading }: GenerationFilterProps) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2">
      <div className="flex gap-2 min-w-max">
        {GENERATIONS.map((gen) => {
          const isSelected = selectedGen === gen.id;
          
          return (
            <button
              key={gen.id}
              onClick={() => onSelectGen(gen.id)}
              disabled={isLoading}
              className={cn(
                "cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95",
                isSelected 
                  ? "bg-[var(--accent-primary)] text-white shadow-md"
                  : "bg-[var(--secondary-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]"
              )}
            >
              {gen.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
