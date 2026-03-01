import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useCategoriesStore } from '@/stores/categories.store';
import { useCurrencyStore } from '@/stores/currency.store';
import { apiClient } from '@/services/api';

export default function AddTransactionScreen() {
    const router = useRouter();
    const { fetchDashboardData } = useDashboardStore();
    const { categories, fetchCategories } = useCategoriesStore();
    const { currentRate, fetchRate } = useCurrencyStore();

    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO');
    const [merchant, setMerchant] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isExpense, setIsExpense] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchRate();
    }, []);

    async function handleSave() {
        if (!amount || !merchant) {
            Alert.alert('Error', 'Debe ingresar el monto y el comercio.');
            return;
        }

        setLoading(true);
        try {
            const finalAmount = isExpense ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

            await apiClient.post('/transactions', {
                amount: finalAmount,
                original_currency: currency,
                merchant_name: merchant,
                description: description,
                category_id: categoryId || undefined,
                date: new Date().toISOString(),
                source: 'manual'
            });

            await fetchDashboardData();
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error guardando transacción.');
        } finally {
            setLoading(false);
        }
    }

    // Calcular el equivalente aproximado si hay tasa
    const equivalent = currentRate ? (currency === 'USD' ? Number(amount) * currentRate : Number(amount) / currentRate).toFixed(2) : '-';
    const eqSymbol = currency === 'USD' ? 'C$' : '$';

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <ScrollView className="flex-1 px-6 pt-4">
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full bg-zinc-900 active:bg-zinc-800">
                        <Ionicons name="arrow-back" size={24} color="#f4f4f5" />
                    </TouchableOpacity>
                    <Text className="text-white text-3xl font-bold">Resgistrar</Text>
                </View>

                {/* Tipo de transacción */}
                <View className="flex-row bg-zinc-900 rounded-xl p-1 mb-8 border border-zinc-800">
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-lg items-center ${isExpense ? 'bg-indigo-600' : 'bg-transparent'}`}
                        onPress={() => setIsExpense(true)}
                    >
                        <Text className={`font-semibold ${isExpense ? 'text-white' : 'text-zinc-400'}`}>Gasto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-lg items-center ${!isExpense ? 'bg-emerald-600' : 'bg-transparent'}`}
                        onPress={() => setIsExpense(false)}
                    >
                        <Text className={`font-semibold ${!isExpense ? 'text-white' : 'text-zinc-400'}`}>Ingreso</Text>
                    </TouchableOpacity>
                </View>

                {/* Monto y Moneda */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity
                        className="bg-zinc-800 h-16 w-16 rounded-xl items-center justify-center mr-3 border border-zinc-700"
                        onPress={() => setCurrency(currency === 'NIO' ? 'USD' : 'NIO')}
                    >
                        <Text className="text-white text-xl font-bold">{currency === 'USD' ? '$' : 'C$'}</Text>
                        <Text className="text-zinc-500 text-[10px]">TOCAR</Text>
                    </TouchableOpacity>
                    <TextInput
                        className={`flex-1 h-16 bg-transparent text-5xl font-black ${isExpense ? 'text-white' : 'text-emerald-400'}`}
                        placeholder="0.00"
                        placeholderTextColor="#3f3f46"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-zinc-500 text-sm">~ {eqSymbol}{equivalent} <Text className="text-zinc-700">(Tasa BCN: {currentRate || 'N/A'})</Text></Text>
                </View>

                {/* Inputs */}
                <Text className="text-zinc-400 font-medium mb-2 uppercase text-xs tracking-wider">Comercio / Origen</Text>
                <TextInput
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500 mb-6"
                    placeholder="Ej. Walmart, DiDi, Nómina"
                    placeholderTextColor="#71717a"
                    value={merchant}
                    onChangeText={setMerchant}
                />

                <Text className="text-zinc-400 font-medium mb-2 uppercase text-xs tracking-wider">Descripción (opcional)</Text>
                <TextInput
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500 mb-6"
                    placeholder="Razón del gasto..."
                    placeholderTextColor="#71717a"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Categories */}
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-zinc-400 font-medium uppercase text-xs tracking-wider">Categoría</Text>
                    <Text className="text-indigo-400 text-xs font-semibold">Si dejas vacío, Gemini lo inferirá</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            className={`mr-3 px-4 py-3 rounded-2xl flex-row items-center border ${categoryId === cat.id ? 'border-indigo-500 bg-indigo-600/20' : 'border-zinc-800 bg-zinc-900'}`}
                            onPress={() => setCategoryId(categoryId === cat.id ? '' : cat.id)}
                        >
                            <Text className="mr-2 text-base">{cat.icon}</Text>
                            <Text className={`font-medium ${categoryId === cat.id ? 'text-indigo-300' : 'text-zinc-300'}`}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Submit */}
                <TouchableOpacity
                    className="w-full h-14 bg-indigo-600 rounded-xl items-center justify-center mb-12 active:bg-indigo-700"
                    disabled={loading}
                    onPress={handleSave}
                >
                    {loading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white font-bold text-lg">Guardar Movimiento</Text>}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
