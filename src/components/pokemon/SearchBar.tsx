"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== undefined) {
        onSearch(query.trim().toLowerCase());
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toLowerCase());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center w-full",
        "bg-[var(--elevated-card)] border border-[var(--border-subtle)] rounded-xl",
        "transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--accent-primary)]",
        "shadow-sm"
      )}
    >
      <div className="pl-4 pr-3 text-[var(--text-muted)] flex items-center justify-center">
        {isLoading ? (
          <Loader2 size={20} className="animate-spin text-[var(--accent-primary)]" />
        ) : (
          <Search size={20} />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or number..."
        className="w-full py-4 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base font-medium"
      />
      <div className="flex items-center gap-2 pr-4">
        {!query && (
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--border-subtle)]">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </div>
        )}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
