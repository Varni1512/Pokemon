"use client";

import { POKEMON_TYPES, TYPE_COLORS } from '@/constants/pokemonTypes';
import { cn } from '@/lib/utils';

interface TypeFilterProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  isLoading?: boolean;
}

export function TypeFilter({ selectedType, onSelectType, isLoading }: TypeFilterProps) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2">
      <div className="flex gap-2 min-w-max">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedType === type;
          const typeColor = TYPE_COLORS[type];
          
          return (
            <button
              key={type}
              onClick={() => onSelectType(selectedType === type ? 'all' : type)}
              disabled={isLoading}
              className={cn(
                "cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-sm hover:scale-105 active:scale-95",
                isSelected 
                  ? "text-white"
                  : "bg-[var(--secondary-bg)] text-[var(--text-primary)] hover:brightness-95 dark:hover:brightness-125"
              )}
              style={{ 
                backgroundColor: isSelected ? typeColor : undefined,
                border: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : typeColor}`,
                textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.6)' : 'none',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
