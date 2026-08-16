"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowDownAZ, ArrowUpAZ, ArrowDown10, ArrowUp10 } from "lucide-react";

export type SortOption = 'id_asc' | 'id_desc' | 'name_asc' | 'name_desc' | 'hp_desc' | 'attack_desc' | 'speed_desc';

interface SortFilterProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortFilter({ sortBy, onSortChange }: SortFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'id_asc', label: 'Lowest Number First', icon: <ArrowDown10 size={16} /> },
    { value: 'id_desc', label: 'Highest Number First', icon: <ArrowUp10 size={16} /> },
    { value: 'name_asc', label: 'A-Z', icon: <ArrowDownAZ size={16} /> },
    { value: 'name_desc', label: 'Z-A', icon: <ArrowUpAZ size={16} /> },
    { value: 'hp_desc', label: 'Highest HP', icon: <ArrowUp10 size={16} /> },
    { value: 'attack_desc', label: 'Highest Attack', icon: <ArrowUp10 size={16} /> },
    { value: 'speed_desc', label: 'Highest Speed', icon: <ArrowUp10 size={16} /> },
  ];

  const currentOption = options.find(o => o.value === sortBy) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3 py-2 z-40" ref={dropdownRef}>
      <span className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-wider">Sort by</span>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[var(--elevated-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] rounded-xl text-sm font-semibold text-[var(--text-primary)] transition-all shadow-sm"
      >
        {currentOption.icon}
        {currentOption.label}
        <ChevronDown size={16} className={cn("text-[var(--text-muted)] transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--elevated-card)] border border-[var(--border-subtle)] rounded-xl shadow-2xl py-2 overflow-hidden flex flex-col z-50">
          {options.map((opt) => {
            const isSelected = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onSortChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "cursor-pointer flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors w-full text-left",
                  isSelected 
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)]"
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
