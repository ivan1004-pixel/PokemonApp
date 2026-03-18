// hooks/useEvolutionChain.ts
import { useEffect, useState } from 'react';
import { Pokemon } from '../types/pokemon'; // <-- Importamos tu tipo Pokemon

// Definimos la estructura de la respuesta de la cadena de evolución
interface EvolutionChainLink {
  species: {
    name: string;
    url: string; // URL para obtener los detalles de esta especie (ej. /pokemon-species/1/)
  };
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionDetail {
  id: string;
  name: string;
  imageUrl: string;
}

// URL de la API de sprites para las imágenes
const getPokemonImageUrl = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Función recursiva para aplanar la cadena de evolución
const parseEvolutionChain = (chain: EvolutionChainLink): EvolutionDetail[] => {
  const evolutions: EvolutionDetail[] = [];
  let currentLink: EvolutionChainLink | undefined = chain;

  while (currentLink) {
    const speciesUrlParts = currentLink.species.url.split('/');
    const id = speciesUrlParts[speciesUrlParts.length - 2]; // Extraemos el ID de la URL

    evolutions.push({
      id: id,
      name: currentLink.species.name,
      imageUrl: getPokemonImageUrl(id),
    });

    // Pasamos al siguiente eslabón (solo tomamos la primera evolución)
    currentLink = currentLink.evolves_to[0];
  }
  return evolutions;
};

// Hook personalizado
export const useEvolutionChain = (pokemon: Pokemon | null) => {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- ESTA ES LA LÍNEA MÁS IMPORTANTE ---
    // Comprobamos no solo el pokémon, sino que la URL de la especie exista
    if (!pokemon || !pokemon.species || !pokemon.species.url) {
      setEvolutionChain([]); // Reseteamos la cadena si no hay datos
      return;
    }
    // --- FIN DE LA COMPROBACIÓN ---

    const fetchEvolutionChain = async () => {
      setIsLoading(true);
      setError(null);
      setEvolutionChain([]);

      try {
        // 1. Obtener la URL de la especie del Pokémon
        // (Ya no necesitamos el fetch de /pokemon/{id} porque ya lo tenemos)
        const speciesResponse = await fetch(pokemon.species.url); // <-- Ahora esto es seguro
        if (!speciesResponse.ok) throw new Error('Failed to fetch species data');
        const speciesData = await speciesResponse.json();

        const evolutionChainUrl = speciesData.evolution_chain?.url;
        if (!evolutionChainUrl) {
          setIsLoading(false);
          return; // No tiene cadena de evolución
        }

        // 2. Obtener la cadena de evolución
        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) throw new Error('Failed to fetch evolution data');
        const evolutionData = await evolutionResponse.json();

        // 3. Parsear la cadena y guardarla en el estado
        const parsedChain = parseEvolutionChain(evolutionData.chain);
        setEvolutionChain(parsedChain);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar evoluciones');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [pokemon]); // Se ejecuta cada vez que el Pokémon (ID) cambia

  return { evolutionChain, isLoading, error };
};