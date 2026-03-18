// context/FavoritesContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// Definimos qué va a tener nuestro contexto
interface FavoritesContextType {
  favorites: number[]; // Array de IDs (ej: [1, 4, 25])
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

// Creamos el Contexto
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const FAVORITES_KEY = '@pokemon_favorites'; // Clave para guardar en AsyncStorage

// Creamos el "Proveedor" que envolverá nuestra app
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // 1. Cargar favoritos guardados al iniciar la app
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites !== null) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (e) {
        console.error('Error al cargar favoritos', e);
      }
    };
    loadFavorites();
  }, []);

  // 2. Guardar favoritos cada vez que la lista cambie
  const saveFavorites = async (favs: number[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (e) {
      console.error('Error al guardar favoritos', e);
    }
  };

  const addFavorite = (id: number) => {
    setFavorites((prevFavs) => {
      const newFavs = [...prevFavs, id];
      saveFavorites(newFavs);
      return newFavs;
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prevFavs) => {
      const newFavs = prevFavs.filter((favId) => favId !== id);
      saveFavorites(newFavs);
      return newFavs;
    });
  };

  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// 3. El hook "fácil" para usar el contexto en otras pantallas
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
};