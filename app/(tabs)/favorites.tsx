// app/favorites.tsx
import { Stack } from 'expo-router'; // <-- Importado para reciclar el header
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonCard from '../../components/PokemonCard';
import { AppColors } from '../../constants/Colors';
import { usePokemonDetailsByIds } from '../../hooks/usePokemonDetailsByIds'; // <-- Ruta corregida

export default function FavoritesScreen() {
  const { pokemon, isLoading, error } = usePokemonDetailsByIds();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centered, styles.container]}>
        {/* Header para la pantalla de carga */}
        <Stack.Screen options={{ headerShown: true, title: 'Favoritos' }} />
        <ActivityIndicator size="large" color={AppColors.primaryRed} />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.centered, styles.container]}>
        {/* Header para la pantalla de error */}
        <Stack.Screen options={{ headerShown: true, title: 'Favoritos' }} />
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (pokemon.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header para la pantalla vacía */}
        <Stack.Screen options={{ headerShown: true, title: 'Favoritos' }} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Aún no tienes favoritos.</Text>
          <Text style={styles.emptySubText}>
            ¡Ve a la Pokédex y presiona el ❤️ en un Pokémon!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header para la lista principal */}
      <Stack.Screen options={{ headerShown: true, title: 'Favoritos' }} />
      <FlatList
        data={pokemon}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: AppColors.textDark,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textDark,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: AppColors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
});