import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategoriesStore } from '@/stores/categories.store';

const COMMON_ICONS = ['📌', '🚗', '🛒', '🎬', '☕', '⛽', '💰', '🎮', '✈️', '🐶', '📚', '👕'];

export default function AddCategoryScreen() {
    const router = useRouter();
    const { createCategory } = useCategoriesStore();

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('📌');
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        if (!name) {
            Alert.alert('Error', 'Debe ingresar un nombre.');
            return;
        }

        setLoading(true);
        try {
            await createCategory(name, icon);
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error guardando categoría.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView className="flex-1 px-6 pt-4">
                <View className="flex-row items-center mb-8">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full bg-zinc-900 active:bg-zinc-800">
                        <Ionicons name="arrow-back" size={24} color="#f4f4f5" />
                    </TouchableOpacity>
                    <Text className="text-white text-3xl font-bold">Nueva Categoría</Text>
                </View>

                {/* Mensaje Informativo UI en vez de solo Alert si lo desean, pero mantendremos el Alert por ahora */}

                <Text className="text-zinc-400 font-medium mb-3 uppercase text-xs tracking-wider">Icono</Text>
                <View className="flex-row flex-wrap mb-6">
                    {COMMON_ICONS.map(ic => (
                        <TouchableOpacity
                            key={ic}
                            className={`w-14 h-14 rounded-full items-center justify-center mr-2 mb-2 border ${icon === ic ? 'border-indigo-500 bg-indigo-600/30' : 'border-zinc-800 bg-zinc-900'}`}
                            onPress={() => setIcon(ic)}
                        >
                            <Text className="text-2xl">{ic}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-zinc-400 font-medium mb-2 uppercase text-xs tracking-wider">Nombre de categoría</Text>
                <TextInput
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500 mb-10"
                    placeholder="Ej. Comida de Perro"
                    placeholderTextColor="#71717a"
                    value={name}
                    onChangeText={setName}
                />

                <TouchableOpacity
                    className="w-full h-14 bg-indigo-600 rounded-xl items-center justify-center mb-12 active:bg-indigo-700"
                    disabled={loading}
                    onPress={handleSave}
                >
                    {loading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white font-bold text-lg">Crear Categoría</Text>}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
