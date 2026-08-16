import { cn } from "@/lib/utils";

export function PokemonSkeleton() {
  return (
    <div className={cn(
      "relative rounded-2xl overflow-hidden p-4",
      "bg-[var(--card-bg)] border border-[var(--border-subtle)]",
      "h-[280px] flex flex-col items-center justify-between",
      "animate-pulse"
    )}>
      {/* Top Header */}
      <div className="w-full flex justify-between items-center">
        <div className="w-12 h-4 bg-[var(--text-muted)] opacity-20 rounded" />
        <div className="w-8 h-8 bg-[var(--text-muted)] opacity-20 rounded-full" />
      </div>

      {/* Image Skeleton */}
      <div className="w-32 h-32 bg-[var(--text-muted)] opacity-10 rounded-full mt-4" />

      {/* Bottom Info */}
      <div className="w-full mt-auto flex flex-col items-center gap-2">
        <div className="w-24 h-6 bg-[var(--text-muted)] opacity-20 rounded" />
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-[var(--text-muted)] opacity-10 rounded-full" />
          <div className="w-16 h-6 bg-[var(--text-muted)] opacity-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
