// hooks/usePokemonList.ts
import { useEffect, useState } from 'react';
import { getPokemonDetailsByUrl, getPokemonList } from '../api/pokemonApi';
import { Pokemon } from '../types/pokemon';

const POKEMON_LIMIT = 20; // <-- Cuántos cargar cada vez

export const usePokemonList = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- NUEVOS ESTADOS PARA SCROLL INFINITO ---
  const [offset, setOffset] = useState(0); // <-- Para saber por dónde empezar la siguiente carga
  const [isLoadingMore, setIsLoadingMore] = useState(false); // <-- Para el spinner de abajo
  const [hasMore, setHasMore] = useState(true); // <-- Para saber si ya cargamos todo

  // Esta función ahora solo carga la PRIMERA tanda
  const loadPokemon = async () => {
    if (isLoading) return; // Evitar cargas duplicadas
    setIsLoading(true);
    setError(null);
    try {
      const listResponse = await getPokemonList(POKEMON_LIMIT, 0); // Carga inicial
      const detailPromises = listResponse.results.map((p) =>
        getPokemonDetailsByUrl(p.url)
      );
      const detailedPokemon = await Promise.all(detailPromises);
      setPokemonList(detailedPokemon);
      setOffset(POKEMON_LIMIT); // <-- Preparamos el offset para la *siguiente* carga
      setHasMore(listResponse.results.length === POKEMON_LIMIT); // <-- Checa si hay más
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- NUEVA FUNCIÓN PARA CARGAR MÁS ---
  const loadMorePokemon = async () => {
    // Evita cargar más si ya está cargando o si no hay más Pokémon
    if (isLoading || isLoadingMore || !hasMore) return; 
    
    setIsLoadingMore(true);
    try {
      const listResponse = await getPokemonList(POKEMON_LIMIT, offset);
      
      // Si la API ya no devuelve resultados, es que llegamos al final
      if (listResponse.results.length === 0) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }
      
      const detailPromises = listResponse.results.map((p) =>
        getPokemonDetailsByUrl(p.url)
      );
      const detailedPokemon = await Promise.all(detailPromises);
      
      // <-- ¡CLAVE! Añadimos los nuevos Pokémon a la lista existente
      setPokemonList(prevList => [...prevList, ...detailedPokemon]);
      
      // <-- Actualizamos el offset
      setOffset(prevOffset => prevOffset + POKEMON_LIMIT); 
      setHasMore(listResponse.results.length === POKEMON_LIMIT);

    } catch (err) {
      // (Podríamos manejar un error de "cargar más" aquí si quisiéramos)
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPokemon(); // Carga inicial solo una vez
  }, []);

  // --- DEVOLVEMOS LOS NUEVOS VALORES ---
  return { 
    pokemonList, 
    isLoading, 
    error, 
    loadPokemon, // Para refrescar
    loadMorePokemon, // <-- La nueva función
    isLoadingMore // <-- El nuevo estado
  };
};