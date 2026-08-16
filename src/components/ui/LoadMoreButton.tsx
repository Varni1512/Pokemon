"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function LoadMoreButton({ onClick, isLoading, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="w-full flex justify-center py-12">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300",
          "bg-[var(--accent-primary)] text-white shadow-lg hover:shadow-xl",
          "hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--primary-bg)] focus:ring-[var(--accent-primary)]",
          "disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Loading Pokémon...
          </>
        ) : (
          "Load More Pokémon"
        )}
      </button>
    </div>
  );
}
