// constants/TypeColors.ts
import { PokemonType } from '../types/pokemon';

// Mapeo de tipos de Pokémon a colores hexadecimales
export const TypeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  steel: '#B7B7CE',
  fairy: '#DDA0DD',
  dark: '#705746',
};

// Color por defecto si un tipo no se encuentra
export const DEFAULT_COLOR = '#68A090'; // Un gris-verde neutro

/**
 * Función de ayuda para obtener el color basado en el primer tipo de un Pokémon
 * @param types Array de tipos del Pokémon (viene de nuestra interfaz PokemonType)
 * @returns El código de color correspondiente
 */
export const getColorByPokemonType = (types: PokemonType[]): string => {
  if (types && types.length > 0) {
    // Usamos el primer tipo como el color principal
    const primaryType = types[0].type.name.toLowerCase();
    return TypeColors[primaryType] || DEFAULT_COLOR;
  }
  return DEFAULT_COLOR;
};