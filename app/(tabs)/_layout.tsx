// app/(drawer)/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { AppColors } from '../../constants/Colors';

// Helper para el ícono de "Aleatorio"
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: AppColors.primaryRed,
        drawerInactiveTintColor: AppColors.inactiveTab,
        headerShown: false, 
      }}
    >
      {/* Pantalla 1: Pokédex (index.tsx) */}
      <Drawer.Screen
        name="index"
        options={{
          title: 'Pokédex más mejor de todos',
          headerShown: true, // <-- Muestra el header
          drawerIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/pokeball.png')}
              style={[styles.pokeballIcon, { tintColor: color }]}
            />
          ),
          
          // --- ¡AQUÍ ESTÁ EL CORAZÓN! ---
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/favorites')} 
              style={{ marginRight: 15 }}
            >
              <FontAwesome
                name="heart"
                size={24}
                color={AppColors.primaryRed}
              />
            </Pressable>
          ),
          // --- FIN DEL CORAZÓN ---
        }}
      />
      
      {/* Pantalla 2: Aleatorio (random.tsx) */}
      <Drawer.Screen
        name="random"
        options={{
          title: 'Aleatorio',
          headerShown: true,
          drawerIcon: ({ color }) => <TabBarIcon name="random" color={color} />,
        }}
      />

    </Drawer>
  );
}

const styles = StyleSheet.create({
  pokeballIcon: {
    width: 28,
    height: 28,
    marginBottom: -3,
  },
});