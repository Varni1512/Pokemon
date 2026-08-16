"use client";

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function FavoriteButton({ isFavorite, onClick, className, size = 20, strokeWidth = 2 }: FavoriteButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.8 }}
      className={cn(
        "p-2 rounded-full transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        strokeWidth={strokeWidth}
        className={cn(
          "transition-colors duration-200",
          isFavorite ? "fill-red-500 text-red-500" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        )}
      />
    </motion.button>
  );
}
