"use client";

import { useCompare } from "@/hooks/useCompare";
import { X, Scale } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function CompareTray() {
  const { compareIds, clearCompare } = useCompare();
  const pathname = usePathname();

  if (compareIds.length === 0 || pathname === '/compare') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
      >
        <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-2xl rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold">
              <Scale size={18} className="text-[var(--accent-primary)]" />
              <span>Compare Pokémon</span>
            </div>
            <button 
              onClick={clearCompare}
              className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-1"
              aria-label="Clear comparison"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {compareIds.length} / 2 selected
            </span>
            <Link 
              href="/compare"
              className="bg-[var(--accent-primary)] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
            >
              Compare Now
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
