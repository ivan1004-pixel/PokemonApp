// app/pokemon/[id].tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Hooks y Helpers ---
import {
  DEFAULT_COLOR,
  getColorByPokemonType,
  TypeColors,
} from '../../constants/TypeColors';
import { useFavorites } from '../../context/FavoritesContext';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { usePokemonExtras } from '../../hooks/usePokemonExtras';
import { PokemonType } from '../../types/pokemon';

// --- Componentes de UI Internos ---
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const TypeBadge = ({ type, style }: { type: string, style?: object }) => (
  <View
    style={[
      styles.typeBadge,
      { backgroundColor: TypeColors[type] || DEFAULT_COLOR },
      style,
    ]}
  >
    <Text style={styles.typeText}>{capitalize(type)}</Text>
  </View>
);

// --- Pantalla Principal ---
export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams();
  const pokemonId = Array.isArray(id) ? id[0] : id;

  const {
    pokemon,
    isLoading: isLoadingPokemon,
    error: pokemonError,
  } = usePokemonDetail(pokemonId);
  
  const {
    evolutionChain,
    damageRelations,
    region,
    isLoading: isLoadingExtras,
  } = usePokemonExtras(pokemon);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFav = pokemon ? isFavorite(pokemon.id) : false;

  const toggleFavorite = () => {
    if (!pokemon) return;
    if (isFav) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon.id);
    }
  };

  const pokemonColor = pokemon
    ? getColorByPokemonType(pokemon.types)
    : '#F5F5FF';

  if (isLoadingPokemon || !pokemonId) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: pokemonColor }]}>
        <ActivityIndicator size="large" color="#E63F34" />
      </SafeAreaView>
    );
  }

  if (pokemonError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar Pokémon.</Text>
      </SafeAreaView>
    );
  }

  if (!pokemon) return null;

  const imageUrl =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  const handleNavigation = (newId: number) => {
    if (newId <= 0) return;
    router.replace(`/pokemon/${newId}`);
  };

  // --- Renderizado (El JSX) ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: pokemonColor }]}>
      
      <Stack.Screen
        options={{
          title: `${capitalize(pokemon.name)} #${pokemon.id.toString().padStart(3, '0')}`,
          headerStyle: { backgroundColor: pokemonColor },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => handleNavigation(pokemon.id - 1)}
              style={styles.headerButton}
            >
              <FontAwesome name="chevron-left" size={24} color="#FFF" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => handleNavigation(pokemon.id + 1)}
              style={styles.headerButton}
            >
              <FontAwesome name="chevron-right" size={24} color="#FFF" />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Tarjeta Principal --- */}
        <View style={styles.card}>
          <Pressable onPress={toggleFavorite} style={styles.heartButton}>
            <FontAwesome
              name={isFav ? 'heart' : 'heart-o'}
              size={28}
              color={isFav ? '#E63F34' : '#AAA'}
            />
          </Pressable>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          {/* Este typesContainer sigue centrado */}
          <View style={styles.typesContainer}> 
            {pokemon.types.map((typeInfo: PokemonType) => (
              <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} />
            ))}
          </View>
        </View>

        {/* --- Tarjeta de Estadísticas --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estadísticas Base</Text>
          {pokemon.stats.map((statInfo) => (
            <View key={statInfo.stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{capitalize(statInfo.stat.name)}</Text>
              <Text style={styles.statValue}>{statInfo.base_stat}</Text>
            </View>
          ))}
        </View>

        {/* --- Tarjeta de Evoluciones --- */}
        {isLoadingExtras ? (
          <ActivityIndicator color="#E63F34" style={{ marginVertical: 20 }} />
        ) : (
          evolutionChain.length > 1 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Evoluciones</Text>
              <View style={styles.evolutionContainer}>
                {evolutionChain.map((evo, index) => (
                  <React.Fragment key={evo.id}>
                    <Pressable
                      style={styles.evoCard}
                      onPress={() => handleNavigation(parseInt(evo.id, 10))}
                    >
                      <Image source={{ uri: evo.imageUrl }} style={styles.evoImage} />
                      <Text style={styles.evoName}>{capitalize(evo.name)}</Text>
                    </Pressable>
                    {index < evolutionChain.length - 1 && (
                      <FontAwesome
                        name="long-arrow-right"
                        size={24}
                        color="#DDD"
                        style={styles.evoArrow}
                      />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )
        )}

        {/* --- Tarjeta de Debilidades y Región --- */}
        {!isLoadingExtras && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Análisis de Tipo y Región</Text>
            {region && (
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Región:</Text>
                <Text style={styles.infoValue}>{capitalize(region.replace('generation-', ''))}</Text>
              </View>
            )}
            
            {/* --- CORRECCIÓN AQUÍ --- */}
            <View style={styles.infoRow}>
              <Text style={styles.infoTitle}>Débil contra:</Text>
              {/* Le decimos a este View que sea flexible y alinee a la izquierda */}
              <View style={[styles.typesContainer, styles.infoTypesContainer]}>
                {damageRelations.weaknesses.length > 0 ? (
                  damageRelations.weaknesses.map((type) => (
                    <TypeBadge key={type} type={type} style={styles.smallBadge} />
                  ))
                ) : ( <Text style={styles.infoValue}>Ninguna</Text> )}
              </View>
            </View>
            
            {/* --- CORRECCIÓN AQUÍ --- */}
            <View style={styles.infoRow}>
              <Text style={styles.infoTitle}>Resistente a:</Text>
              <View style={[styles.typesContainer, styles.infoTypesContainer]}>
                {damageRelations.resistances.length > 0 ? (
                  damageRelations.resistances.map((type) => (
                    <TypeBadge key={type} type={type} style={styles.smallBadge} />
                  ))
                ) : ( <Text style={styles.infoValue}>Ninguna</Text> )}
              </View>
            </View>
            
            {/* --- CORRECCIÓN AQUÍ --- */}
            <View style={styles.infoRow}>
              <Text style={styles.infoTitle}>Inmune a:</Text>
              <View style={[styles.typesContainer, styles.infoTypesContainer]}>
                {damageRelations.immunities.length > 0 ? (
                  damageRelations.immunities.map((type) => (
                    <TypeBadge key={type} type={type} style={styles.smallBadge} />
                  ))
                ) : ( <Text style={styles.infoValue}>Ninguna</Text> )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  // ... (otros estilos)
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 16,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // <-- Esto centra los tipos PRINCIPALES
    flexWrap: 'wrap',
  },
  
  // --- AÑADIMOS ESTE NUEVO ESTILO ---
  infoTypesContainer: {
    flex: 1, // <-- Ocupa el espacio sobrante
    justifyContent: 'flex-start', // <-- Se alinea a la izquierda
  },
  
  typeBadge: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    margin: 4,
  },
  // ... (el resto de estilos sigue igual)
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    paddingVertical: 16,
    alignItems: 'center', 
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    width: '95%',
    maxWidth: 600, 
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 10,
  },
  heartButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  typeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  smallBadge: { paddingVertical: 4, paddingHorizontal: 10 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: { fontSize: 16, color: '#666', width: '60%' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  evolutionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  evoCard: { alignItems: 'center' },
  evoImage: { width: 80, height: 80, backgroundColor: '#F5F5FF', borderRadius: 40 },
  evoName: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 8 },
  evoArrow: { marginHorizontal: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', width: '35%' },
  infoValue: { fontSize: 16, color: '#666', textTransform: 'capitalize' },
  errorText: { fontSize: 18, color: '#E63F34' },
});