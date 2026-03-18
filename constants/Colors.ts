// constants/Colors.ts

// Aquí puedes definir tu paleta de colores
export const AppColors = {
  primaryRed: '#E63F34', // Un rojo vibrante (como la parte superior de la Pokeball)
  secondaryWhite: '#FFFFFF',
  textDark: '#333333',
  textLight: '#555555',
  placeholderGray: '#999999',
  backgroundLight: '#F7F7F7', // Fondo general de la app
  cardBackground: '#FFFFFF', // Fondo de las tarjetas
  shadowColor: '#000000',
  favoriteHeart: '#E63F34', // Rojo para el corazón favorito
  inactiveTab: 'gray',
  // Colores para los tipos de Pokémon (puedes expandir esta lista)
  typeColors: {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
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
    fairy: '#D685AD',
    dark: '#705746',
  },
};

// Puedes definir temas claros y oscuros si quisieras
export const LightTheme = {
  background: AppColors.backgroundLight,
  text: AppColors.textDark,
  card: AppColors.cardBackground,
  primary: AppColors.primaryRed,
};

export const DarkTheme = {
  background: '#333333',
  text: '#FFFFFF',
  card: '#444444',
  primary: AppColors.primaryRed,
};