export const TYPE_COLORS: Record<string, string> = {
  normal: 'var(--type-normal)',
  fire: 'var(--type-fire)',
  water: 'var(--type-water)',
  grass: 'var(--type-grass)',
  electric: 'var(--type-electric)',
  ice: 'var(--type-ice)',
  fighting: 'var(--type-fighting)',
  poison: 'var(--type-poison)',
  ground: 'var(--type-ground)',
  flying: 'var(--type-flying)',
  psychic: 'var(--type-psychic)',
  bug: 'var(--type-bug)',
  rock: 'var(--type-rock)',
  ghost: 'var(--type-ghost)',
  dragon: 'var(--type-dragon)',
  dark: 'var(--type-dark)',
  steel: 'var(--type-steel)',
  fairy: 'var(--type-fairy)',
};

export const POKEMON_TYPES = Object.keys(TYPE_COLORS);

export const GENERATIONS = [
  { id: 'all', label: 'All Gens', offset: 0, limit: 1025 },
  { id: 'gen1', label: 'Gen I', offset: 0, limit: 151 },
  { id: 'gen2', label: 'Gen II', offset: 151, limit: 100 },
  { id: 'gen3', label: 'Gen III', offset: 251, limit: 135 },
  { id: 'gen4', label: 'Gen IV', offset: 386, limit: 107 },
  { id: 'gen5', label: 'Gen V', offset: 493, limit: 156 },
  { id: 'gen6', label: 'Gen VI', offset: 649, limit: 72 },
  { id: 'gen7', label: 'Gen VII', offset: 721, limit: 88 },
  { id: 'gen8', label: 'Gen VIII', offset: 809, limit: 89 },
  { id: 'gen9', label: 'Gen IX', offset: 898, limit: 127 },
];
