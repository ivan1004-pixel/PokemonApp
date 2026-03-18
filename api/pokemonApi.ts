// api/PokemonApi.ts
import {
  EvolutionChainResponse,
  Pokemon,
  PokemonSpecies,
  TypeData
} from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

// Interface interna para la respuesta de la lista
interface PokemonListResponse {
  results: { name: string; url: string }[];
}

/**
 * Obtiene la lista inicial de Pokémon (nombre y URL)
 */
export const getPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
  try {
    const response = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Error al obtener la lista de Pokémon');
    const data: PokemonListResponse = await response.json();
    return data;
  } catch (error) {
    console.error('getPokemonList Error:', error);
    throw error;
  }
};

/**
 * Obtiene los detalles completos de un Pokémon usando su URL
 */
export const getPokemonDetailsByUrl = async (url: string): Promise<Pokemon> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener detalles de ${url}`);
    const data: Pokemon = await response.json();
    return data;
  } catch (error) {
    console.error('getPokemonDetailsByUrl Error:', error);
    throw error;
  }
};

/**
 * Obtiene los detalles completos de un Pokémon por su ID
 * (Esta es la que usaremos en la pantalla de detalle)
 */
export const getPokemonById = async (id: string): Promise<Pokemon> => {
  try {
    const response = await fetch(`${API_URL}/pokemon/${id}`);
    if (!response.ok) throw new Error(`Error al obtener Pokémon con ID ${id}`);
    // ¡Importante! La API nos devuelve el tipo 'Pokemon' completo
    const data: Pokemon = await response.json();
    return data;
  } catch (error) {
    console.error('getPokemonById Error:', error);
    throw error;
  }
};

/**
 * Obtiene los datos de la Especie (para Región y URL de Evolución)
 */
export const getPokemonSpeciesByUrl = async (url: string): Promise<PokemonSpecies> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener la especie');
    const data: PokemonSpecies = await response.json();
    return data;
  } catch (error) {
    console.error('getPokemonSpeciesByUrl Error:', error);
    throw error;
  }
};

/**
 * Obtiene la Cadena de Evolución completa
 */
export const getEvolutionChainByUrl = async (url: string): Promise<EvolutionChainResponse> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener la cadena de evolución');
    const data: EvolutionChainResponse = await response.json();
    return data;
  } catch (error) {
    console.error('getEvolutionChainByUrl Error:', error);
    throw error;
  }
};

/**
 * Obtiene los datos de un Tipo (para Debilidades)
 */
export const getTypeDataByUrl = async (url: string): Promise<TypeData> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener datos del tipo');
    const data: TypeData = await response.json();
    return data;
  } catch (error) {
    console.error('getTypeDataByUrl Error:', error);
    throw error;
  }
};