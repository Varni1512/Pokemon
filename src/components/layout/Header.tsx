"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import { useFavorites } from "@/hooks/useFavorites";

function HeaderContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const isFavoritesView = view === 'favorites';
  const { compareIds } = useCompare();
  const { favorites, isLoaded: favsLoaded } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Explorer", href: "/", active: !isFavoritesView },
    { name: "Favorites", href: "/?view=favorites", active: isFavoritesView, badge: favsLoaded ? favorites.length : 0 },
    { name: "Compare", href: "/compare", active: false, badge: compareIds.length }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--primary-bg)] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-white relative overflow-hidden border-2 border-[var(--card-bg)] shadow-sm group-hover:rotate-12 transition-transform">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#EF4444]" />
              <div className="absolute top-1/2 left-0 right-0 h-1/2 bg-white" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-[#10141E]" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#10141E] -translate-y-1/2" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#FBBF24]">
              Pokédex
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]",
                  item.active
                    ? "bg-[var(--accent-primary)] text-white shadow-md"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--elevated-card)]"
                )}
              >
                {item.name}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center bg-black/20 dark:bg-white/20 text-xs rounded-full px-1.5 min-w-[20px] h-[20px]">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="ml-2 pl-2 border-l border-[var(--border-subtle)]">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded-lg"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[81px] left-0 right-0 bg-[var(--primary-bg)] border-b border-[var(--border-subtle)] shadow-xl p-4 flex flex-col gap-2 z-50">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]",
                item.active
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {item.name}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "inline-flex items-center justify-center text-xs rounded-full px-2 py-0.5 min-w-[24px]",
                  item.active ? "bg-white/20" : "bg-[var(--border-subtle)]"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="mt-2 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between px-4">
            <span className="font-semibold text-[var(--text-secondary)]">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}

export function Header() {
  return (
    <React.Suspense fallback={<header className="w-full h-20 bg-[var(--primary-bg)] border-b border-[var(--border-subtle)]" />}>
      <HeaderContent />
    </React.Suspense>
  );
}
