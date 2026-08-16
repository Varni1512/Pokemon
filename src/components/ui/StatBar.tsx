"use client";

import { motion } from "framer-motion";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export function StatBar({ label, value, max = 255, color = "var(--accent-primary)" }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex items-center gap-4 w-full text-sm">
      <div className="w-24 md:w-32 font-medium text-[var(--text-secondary)] uppercase text-xs tracking-wider">
        {label}
      </div>
      <div className="w-8 text-right font-bold text-[var(--text-primary)]">
        {value}
      </div>
      <div className="flex-1 h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
