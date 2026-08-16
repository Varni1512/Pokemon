export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: unknown[]; // Kept simplified
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
}

export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: PokemonSpeciesFlavorText[];
  genera: {
    genus: string;
    language: NamedAPIResource;
  }[];
}

// Our application-specific types
export interface PokemonBaseData {
  id: number;
  name: string;
  image: string | null;
  types: string[];
  genus: string | null;
  height: number;
  weight: number;
  baseExp: number;
  stats: {
    hp: number;
    attack: number;
    speed: number;
  };
}
