import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We couldn't load Pokémon right now.",
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4">
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-6",
        "bg-[var(--card-bg)] border border-[var(--border-subtle)] text-red-500"
      )}>
        <AlertTriangle size={40} />
      </div>
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] max-w-md mb-8">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "px-6 py-2 rounded-full font-medium transition-colors duration-200",
            "bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)]",
            "hover:bg-[var(--elevated-card)] hover:text-white"
          )}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
