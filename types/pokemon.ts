// types/pokemon.ts

// Esta es la interfaz principal que usará nuestra App
export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  species: PokemonSpecies; // <-- La incluimos desde el inicio
  height: number; // Altura en decímetros
  weight: number; // Peso en hectogramos
}

// Interfaces para las partes internas de la respuesta de la API
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  other?: {
    'official-artwork'?: {
      front_default: string;
    };
  };
}

// Esta es la interfaz clave para evoluciones y región
export interface PokemonSpecies {
  name: string;
  url: string;
  evolution_chain: {
    url: string; // URL de la cadena de evolución
  };
  generation: {
    name: string; // Región (ej: 'generation-i')
  };
}

// --- Interfaces para la Cadena de Evolución ---
export interface EvolutionChainResponse {
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  species: {
    name: string;
    url: string; // URL de la especie (ej. /pokemon-species/1/)
  };
  evolves_to: EvolutionChainLink[];
}

// --- Interfaces para Debilidades (Tipos) ---
export interface TypeData {
  name: string;
  damage_relations: {
    double_damage_from: Array<{ name: string; url: string }>;
    half_damage_from: Array<{ name: string; url: string }>;
    no_damage_from: Array<{ name: string; url: string }>;
  };
}