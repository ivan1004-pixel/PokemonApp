// hooks/usePokemonDetail.ts
import { useEffect, useState } from 'react';
import { getPokemonById } from '../api/pokemonApi'; // <-- Usamos la API (Archivo 3)
import { Pokemon } from '../types/pokemon';

export const usePokemonDetail = (id: string) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay ID (por ejemplo, al cargar la app), no hagas nada
    if (!id) return;

    const loadPokemonDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Llamamos a nuestra API para obtener el Pokémon por su ID
        const data = await getPokemonById(id);
        setPokemon(data);
      } catch (err) {
        setPokemon(null); // Limpiamos datos anteriores si hay error
        setError(
          err instanceof Error
            ? err.message
            : 'Error desconocido al cargar el Pokémon'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemonDetail();
  }, [id]); // <-- Este hook se re-ejecutará cada vez que el ID cambie

  return { pokemon, isLoading, error };
};