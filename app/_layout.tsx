// app/_layout.tsx
import { Stack } from 'expo-router';
import { FavoritesProvider } from '../context/FavoritesContext';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      {/* Le decimos al Stack principal que NUNCA muestre un header.
        Cada pantalla (drawer, favorites, [id]) es ahora responsable
        de mostrar su propio header si lo necesita.
      */}
      <Stack screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="(drawer)" />
        
        <Stack.Screen name="favorites" />
        
        <Stack.Screen
          name="pokemon/[id]"
          options={{
            // (La presentación modal está bien, pero el header 
            // lo controlará el propio archivo [id].tsx)
            presentation: 'modal',
          }}
        />
      </Stack>
    </FavoritesProvider>
  );
}