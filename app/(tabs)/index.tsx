// app/(drawer)/index.tsx
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// (Ya no se importan Stack, router, FontAwesome, ni AppColors aquí)
import { getPokemonById } from '../../api/pokemonApi';
import PokemonCard from '../../components/PokemonCard';
import SearchBar from '../../components/SearchBar';
import { usePokemonList } from '../../hooks/usePokemonList';
import { Pokemon } from '../../types/pokemon';

export default function HomeScreen() {
  // --- Lógica de hooks y estados ---
  const {
    pokemonList,
    isLoading,
    error,
    loadMorePokemon,
    isLoadingMore,
  } = usePokemonList();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Pokemon[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // --- Lógica de Filtro ---
  const filteredPokemon = useMemo(() => {
    if (searchResult !== null) {
      return searchResult;
    }
    if (!searchTerm) {
      return pokemonList;
    }
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm, searchResult]);

  // --- Lógica de Búsqueda API (al dar Enter) ---
  const handleSearchSubmit = async () => {
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const foundPokemon = await getPokemonById(searchTerm.toLowerCase());
      setSearchResult([foundPokemon]);
    } catch (err) {
      Alert.alert('No Encontrado', `No se pudo encontrar un Pokémon llamado "${searchTerm}"`);
      setSearchResult([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- Lógica al cambiar texto ---
  const handleChangeText = (text: string) => {
    setSearchTerm(text);
    if (text === '') {
      setSearchResult(null);
    }
  };

  // --- Lógica de Scroll Infinito ---
  const handleLoadMore = () => {
    if (searchTerm || searchResult !== null) return;
    loadMorePokemon();
  };

  // --- Lógica del Spinner de Carga (Footer) ---
  const renderFooter = () => {
    if (!isLoadingMore && !isSearching) return null;
    return (
      <ActivityIndicator size="small" color="#E63F34" style={styles.footerSpinner} />
    );
  };
  
  // --- Pantalla de Carga Inicial ---
  if (isLoading && pokemonList.length === 0) {
    return (
        <SafeAreaView style={[styles.centered, styles.container]}>
            <ActivityIndicator size="large" color="#E63F34" />
            <Text style={styles.loadingText}>Cargando Pokédex...</Text>
        </SafeAreaView>
    );
  }

  // --- Pantalla de Error Inicial ---
  if (error) {
    return (
        <SafeAreaView style={[styles.centered, styles.container]}>
            <Text style={styles.errorText}>Error: {error}</Text>
        </SafeAreaView>
    );
  }

  // --- Renderizado Principal ---
  return (
    <SafeAreaView style={styles.container}>
      
      {/* (El <Stack.Screen> se borró de aquí) */}

      <SearchBar
        value={searchTerm}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSearchSubmit}
      />
      
      {/* Spinner de búsqueda API */}
      {isSearching && (
        <ActivityIndicator size="large" color="#E63F34" style={styles.footerSpinner} />
      )}

      {/* Mensaje de "No encontrado" */}
      {!isSearching && filteredPokemon.length === 0 && (
         <Text style={styles.errorText}>
           {searchTerm 
             ? `No se encontraron resultados para "${searchTerm}"`
             : 'Cargando...'
           }
         </Text>
      )}

      {/* Lista de Pokémon */}
      <FlatList
        data={filteredPokemon}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        scrollEnabled={!isSearching}
      />
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  footerSpinner: {
    marginVertical: 20,
  },
});