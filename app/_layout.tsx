import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/services/supabase';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  const { session, setSession, setInitialized, initialized } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      // User is signed in but trying to access auth screens
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      // User is not signed in but trying to access protected screens
      router.replace('/(auth)/login');
    }
  }, [session, initialized, segments]);

  if (!initialized) return null; // Or a loading splash screen

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="add-transaction" options={{ presentation: 'modal', title: 'Nuevo Gasto' }} />
        <Stack.Screen name="edit-transaction" options={{ presentation: 'modal', title: 'Editar Gasto' }} />
        <Stack.Screen name="add-category" options={{ presentation: 'modal', title: 'Nueva Categoría' }} />
        <Stack.Screen name="add-goal" options={{ presentation: 'modal', title: 'Nueva Meta' }} />
        <Stack.Screen name="manage-wallets" options={{ presentation: 'modal', title: 'Mis Billeteras' }} />
        <Stack.Screen name="add-business-transaction" options={{ presentation: 'modal', title: 'Registrar Producto' }} />
        <Stack.Screen name="sell-business-transaction" options={{ presentation: 'modal', title: 'Vender Producto' }} />
        <Stack.Screen name="edit-business-transaction" options={{ presentation: 'modal', title: 'Editar Producto' }} />
        <Stack.Screen name="chat" options={{ presentation: 'modal', title: 'Coach Financiero' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
