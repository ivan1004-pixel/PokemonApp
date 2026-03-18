// components/SearchBar.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  // <-- AQUÍ ESTÁ LA LÍNEA CLAVE QUE FALTA
  onSubmitEditing: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmitEditing, // <-- Y LA AÑADIMOS AQUÍ
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <FontAwesome name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar (filtrar) o presionar Enter"
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        // --- Y AÑADIMOS ESTAS PROPS OTRA VEZ ---
        returnKeyType="search" // Pone "Buscar" en el teclado
        onSubmitEditing={onSubmitEditing} // Llama a la función al presionar
      />
    </View>
  );
}

// --- (Los estilos siguen igual) ---
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
});