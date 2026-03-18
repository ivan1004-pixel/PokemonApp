// hooks/usePokemonExtras.ts
import { useEffect, useState } from 'react';
import {
    getEvolutionChainByUrl,
    getPokemonSpeciesByUrl,
    getTypeDataByUrl,
} from '../api/pokemonApi'; // <-- Usamos la API (Archivo 3)
import {
    EvolutionChainLink,
    Pokemon,
    TypeData,
} from '../types/pokemon';

// --- Definimos la Estructura de Salida ---

// Para la cadena de evolución
export interface EvolutionDetail {
  id: string;
  name: string;
  imageUrl: string;
}

// Para las debilidades
export interface DamageRelations {
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
}

// --- Funciones de Ayuda (Helpers) ---

// Helper para obtener la URL de la imagen (lo copiamos aquí para mantener el hook autocontenido)
const getPokemonImageUrl = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Helper para "aplanar" la cadena de evolución
const parseEvolutionChain = (chain: EvolutionChainLink): EvolutionDetail[] => {
  const evolutions: EvolutionDetail[] = [];
  let currentLink: EvolutionChainLink | undefined = chain;

  while (currentLink) {
    const speciesUrlParts = currentLink.species.url.split('/');
    const id = speciesUrlParts[speciesUrlParts.length - 2];

    evolutions.push({
      id: id,
      name: currentLink.species.name,
      imageUrl: getPokemonImageUrl(id),
    });
    currentLink = currentLink.evolves_to[0]; // Tomamos la primera evolución
  }
  return evolutions;
};

// Helper para procesar las debilidades de múltiples tipos
const processDamageRelations = (typesData: TypeData[]): DamageRelations => {
  const weaknesses = new Set<string>();
  const resistances = new Set<string>();
  const immunities = new Set<string>();

  typesData.forEach((type) => {
    type.damage_relations.double_damage_from.forEach((t) => weaknesses.add(t.name));
    type.damage_relations.half_damage_from.forEach((t) => resistances.add(t.name));
    type.damage_relations.no_damage_from.forEach((t) => immunities.add(t.name));
  });

  // Lógica para tipos dobles (ej: Agua/Tierra)
  // Si un tipo es débil (x2) y otro resiste (x0.5), se anulan.
  // Si un tipo es inmune (x0), anula todo lo demás.
  const finalWeaknesses = [...weaknesses].filter(
    (t) => !resistances.has(t) && !immunities.has(t)
  );
  const finalResistances = [...resistances].filter(
    (t) => !weaknesses.has(t) && !immunities.has(t)
  );

  return {
    weaknesses: finalWeaknesses,
    resistances: finalResistances,
    immunities: [...immunities],
  };
};

// --- El Hook Principal ---
export const usePokemonExtras = (pokemon: Pokemon | null) => {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionDetail[]>([]);
  const [damageRelations, setDamageRelations] = useState<DamageRelations>({
    weaknesses: [],
    resistances: [],
    immunities: [],
  });
  const [region, setRegion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Comprobación de seguridad (¡la clave!)
    if (!pokemon || !pokemon.species || !pokemon.species.url) {
      // Limpiamos los estados si no hay Pokémon
      setEvolutionChain([]);
      setDamageRelations({ weaknesses: [], resistances: [], immunities: [] });
      setRegion(null);
      return;
    }

    const loadExtraData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // --- 1. Buscar Especie (para Evolución y Región) ---
        const speciesData = await getPokemonSpeciesByUrl(pokemon.species.url);
        
        // Seteamos la Región
        setRegion(speciesData.generation.name);

        // --- 2. Buscar Cadena de Evolución ---
        if (speciesData.evolution_chain.url) {
          const evoChainData = await getEvolutionChainByUrl(
            speciesData.evolution_chain.url
          );
          setEvolutionChain(parseEvolutionChain(evoChainData.chain));
        }

        // --- 3. Buscar Debilidades (basado en los tipos) ---
        const typePromises = pokemon.types.map((typeInfo) =>
          getTypeDataByUrl(typeInfo.type.url)
        );
        const typesData = await Promise.all(typePromises);
        
        // Procesamos los datos de todos los tipos
        setDamageRelations(processDamageRelations(typesData));

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar datos extra'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadExtraData();
  }, [pokemon]); // Se ejecuta cada vez que el Pokémon cambia

  return { evolutionChain, damageRelations, region, isLoading, error };
};