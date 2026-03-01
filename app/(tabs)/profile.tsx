import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '@/services/supabase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-zinc-950 items-center justify-center px-6">
            <Text className="text-white text-2xl font-bold mb-8">Mi Perfil</Text>

            <TouchableOpacity
                className="w-full h-14 bg-indigo-600/20 border border-indigo-900/50 rounded-xl items-center justify-center mt-4 active:bg-indigo-600/30"
                onPress={() => router.push('/add-category' as any)}
            >
                <Text className="text-indigo-400 font-bold text-lg">Nueva Categoría Personalizada</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full h-14 bg-red-600/20 border border-red-900/50 rounded-xl items-center justify-center mt-8 active:bg-red-600/30"
                onPress={() => supabase.auth.signOut()}
            >
                <Text className="text-red-400 font-bold text-lg">Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}
