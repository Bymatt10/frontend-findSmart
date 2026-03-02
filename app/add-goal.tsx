import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '@/services/api';
import { useGoalsStore } from '@/stores/goals.store';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddGoalScreen() {
    const router = useRouter();
    const { fetchGoals } = useGoalsStore();

    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO');
    const [deadline, setDeadline] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowPicker(false);
        if (selectedDate) setDeadline(selectedDate);
    };

    async function handleSave() {
        if (!title || !targetAmount) {
            Alert.alert('Error', 'Debe ingresar un título y monto objetivo.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/goals', {
                title,
                target_amount: Number(targetAmount),
                target_currency: currency,
                deadline: deadline.toISOString().split('T')[0],
            });
            await fetchGoals();
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error guardando meta.');
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
                    <Text className="text-white text-3xl font-bold">Nueva Meta</Text>
                </View>

                <Text className="text-zinc-400 font-medium mb-2 uppercase text-xs tracking-wider">¿Qué quieres lograr?</Text>
                <TextInput
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500 mb-6"
                    placeholder="Ej. Viaje a Japón, Laptop nueva"
                    placeholderTextColor="#71717a"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text className="text-zinc-400 font-medium mb-2 uppercase text-xs tracking-wider">Monto Objetivo</Text>
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity
                        className="bg-zinc-800 h-14 w-16 rounded-xl items-center justify-center mr-3 border border-zinc-700"
                        onPress={() => setCurrency(currency === 'NIO' ? 'USD' : 'NIO')}
                    >
                        <Text className="text-white text-xl font-bold">{currency === 'USD' ? '$' : 'C$'}</Text>
                        <Text className="text-zinc-500 text-[10px]">TOCAR</Text>
                    </TouchableOpacity>
                    <TextInput
                        className="flex-1 h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500 text-2xl font-bold"
                        placeholder="0.00"
                        placeholderTextColor="#71717a"
                        keyboardType="numeric"
                        value={targetAmount}
                        onChangeText={setTargetAmount}
                    />
                </View>

                <Text className="text-zinc-400 font-medium mb-2 uppercase text-xs tracking-wider">Fecha límite (Calendario)</Text>
                <TouchableOpacity
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 justify-center border border-zinc-800 mb-6"
                    onPress={() => setShowPicker(true)}
                >
                    <Text className="text-white text-lg">{deadline.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showPicker && (
                    <View className="mb-6 w-full items-center">
                        <DateTimePicker
                            value={deadline}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            themeVariant="dark"
                        />
                    </View>
                )}

                <TouchableOpacity
                    className="w-full h-14 bg-indigo-600 rounded-xl items-center justify-center mb-12 active:bg-indigo-700 mt-6"
                    disabled={loading}
                    onPress={handleSave}
                >
                    {loading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white font-bold text-lg">Crear Meta</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
