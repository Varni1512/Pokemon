export function Hero() {
  return (
    <div className="w-full py-12 md:py-16 lg:py-20 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6">
        Explore the Pokémon world.
      </h1>
      <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
        Discover Pokémon, explore their abilities, compare their stats, and build your personal collection.
      </p>
      
      <div className="flex gap-4 md:gap-8 justify-center text-sm md:text-base font-medium text-[var(--text-muted)]">
        <div className="flex flex-col items-center">
          <span className="text-[var(--text-primary)] text-xl font-bold">1025</span>
          <span>Pokémon</span>
        </div>
        <div className="w-px h-10 bg-[var(--border-subtle)]" />
        <div className="flex flex-col items-center">
          <span className="text-[var(--text-primary)] text-xl font-bold">18</span>
          <span>Types</span>
        </div>
        <div className="w-px h-10 bg-[var(--border-subtle)]" />
        <div className="flex flex-col items-center">
          <span className="text-[var(--text-primary)] text-xl font-bold">I — IX</span>
          <span>Generation</span>
        </div>
      </div>
    </div>
  );
}
