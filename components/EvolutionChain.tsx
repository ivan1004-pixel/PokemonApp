// components/EvolutionChain.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppColors } from '../constants/Colors';
import { EvolutionDetail } from '../hooks/useEvolutionChain'; // <-- Importamos la interfaz

interface EvolutionChainProps {
  chain: EvolutionDetail[];
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function EvolutionChain({ chain }: EvolutionChainProps) {
  if (chain.length <= 1) {
    // No mostrar nada si no hay evoluciones
    return null;
  }

  const handlePress = (id: string) => {
    router.replace(`/pokemon/${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadena de Evolución</Text>
      <View style={styles.chainContainer}>
        {chain.map((pokemon, index) => (
          <React.Fragment key={pokemon.id}>
            {/* Renderiza la tarjeta del Pokémon */}
            <Pressable onPress={() => handlePress(pokemon.id)} style={styles.pokemonCard}>
              <Image source={{ uri: pokemon.imageUrl }} style={styles.image} />
              <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
            </Pressable>

            {/* Renderiza la flecha (si no es el último) */}
            {index < chain.length - 1 && (
              <FontAwesome name="long-arrow-right" size={24} color={AppColors.textLight} style={styles.arrow} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginTop: 20,
    elevation: 8,
    shadowColor: AppColors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20, // Aumentado para más espacio
    color: AppColors.textDark,
  },
  chainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap', // Permite que se ajuste si no cabe
  },
  pokemonCard: {
    alignItems: 'center',
    padding: 8,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: '#f2f2f2', // Fondo suave para la imagen
    borderRadius: 40, // Círculo
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textDark,
    marginTop: 8,
  },
  arrow: {
    marginHorizontal: 8,
  },
});