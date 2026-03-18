// hooks/usePokemonDetailsByIds.ts
import { useEffect, useState } from 'react';
import { getPokemonById } from '../api/pokemonApi';
import { useFavorites } from '../context/FavoritesContext'; // <-- El "Cerebro"
import { Pokemon } from '../types/pokemon';

export const usePokemonDetailsByIds = () => {
  const { favorites } = useFavorites(); // <-- Obtenemos el array de IDs [1, 4, 25]

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setPokemon([]); // Si no hay favoritos, no busques nada
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        // Creamos un array de promesas
        const promises = favorites.map((id) =>
          getPokemonById(String(id))
        );
        // Esperamos a que TODAS se completen
        const results = await Promise.all(promises);
        setPokemon(results);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar favoritos'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]); // <-- Se re-ejecuta cada vez que la lista de favoritos cambie

  return { pokemon, isLoading, error };
};