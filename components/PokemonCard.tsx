// components/PokemonCard.tsx
import { Link } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getColorByPokemonType } from '../constants/TypeColors';
import { Pokemon } from '../types/pokemon';

// Interfaz para definir qué props espera este componente
interface PokemonCardProps {
  pokemon: Pokemon;
}

// Función para poner en mayúscula la primera letra
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  // Obtenemos la URL de la imagen (usamos la oficial si existe)
  const imageUrl =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  // Obtenemos el color basado en el tipo (¡de nuestro Archivo 2!)
  const cardColor = getColorByPokemonType(pokemon.types);

  return (
    // Usamos Link de expo-router para navegar al detalle al presionar
    <Link href={`/pokemon/${pokemon.id}`} asChild>
      <Pressable>
        {/* El View principal usa el color dinámico */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Image
            source={require('../assets/images/pokeball.png')}
            style={styles.pokeballBg}
          />
          <Text style={styles.id}>
            #{pokemon.id.toString().padStart(3, '0')}
          </Text>
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      </Pressable>
    </Link>
  );
}

// --- Estilos ---

// Calculamos el ancho de la tarjeta para que quepan 2 por fila
const cardWidth = Dimensions.get('window').width / 2 - 16; // 16 = 8 de margen a cada lado

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden', // Importante para que la Pokeball no se salga
  },
  id: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 8,
  },
  pokeballBg: {
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: -10,
    right: -10,
    opacity: 0.2,
    tintColor: '#FFFFFF', // Hacemos la imagen blanca
  },
});