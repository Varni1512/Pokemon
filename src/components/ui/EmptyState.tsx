import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = "Pokémon not found", 
  description = "We couldn't find that Pokémon. Try another name or ID.",
  action
}: EmptyStateProps) {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4">
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-6",
        "bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
      )}>
        <SearchX size={40} />
      </div>
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] max-w-md mb-8">
        {description}
      </p>
      {action}
    </div>
  );
}
