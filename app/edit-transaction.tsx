import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useCategoriesStore } from '@/stores/categories.store';
import { useWalletsStore } from '@/stores/wallets.store';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as icons from 'lucide-react-native';
import { apiClient } from '@/services/api';

export default function EditTransactionScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { fetchDashboardData, deleteTransaction } = useDashboardStore();
    const { categories, fetchCategories } = useCategoriesStore();
    const { wallets, fetchWallets } = useWalletsStore();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchCategories();
        fetchWallets();

        apiClient.get(`/transactions/${id}`).then(res => {
            const data = res.data?.data;
            if (data) {
                setType(Number(data.amount) < 0 ? 'expense' : 'income');
                setAmount(Math.abs(Number(data.amount)).toString());
                setDescription(data.merchant_name || data.description || '');
                setCurrency(data.original_currency || 'NIO');
                setCategoryId(data.category_id || data.categories?.id || null);
                setWalletId(data.wallet_id || null);
            }
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            Alert.alert('Error', 'No se pudo cargar la transacción');
            router.back();
        });
    }, [id]);

    const handleSave = async () => {
        if (!amount || isNaN(Number(amount))) return Alert.alert('Error', 'Monto inválido');
        if (!description) return Alert.alert('Error', 'Descripción requerida');

        setIsSaving(true);
        try {
            const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
            await apiClient.patch(`/transactions/${id}`, {
                amount: finalAmount,
                merchant_name: description,
                category_id: categoryId,
                original_currency: currency,
                wallet_id: walletId
            });
            fetchDashboardData();
            router.back();
        } catch (error) {
            console.error('Error saving:', error);
            Alert.alert('Error', 'Ocurrió un error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = () => {
        Alert.alert('Eliminar', '¿Seguro que deseas eliminar esta transacción?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    await deleteTransaction(id as string);
                    router.back();
                }
            }
        ]);
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
                <Text className="text-zinc-500">Cargando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <View className="flex-row items-center justify-between px-5 pt-2 pb-6">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center border border-zinc-800">
                    <icons.ArrowLeft size={20} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Editar Movimiento</Text>
                <TouchableOpacity onPress={confirmDelete} className="w-10 h-10 bg-red-500/10 rounded-full items-center justify-center border border-red-900/20">
                    <icons.Trash2 size={20} color="#f87171" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* Opciones */}
                <View className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800 mb-6">
                    <View className="flex-row justify-between mb-6 space-x-2">
                        <TouchableOpacity
                            onPress={() => setType('expense')}
                            className={`flex-1 py-3 rounded-xl items-center border ${type === 'expense' ? 'bg-red-500/20 border-red-500/50' : 'bg-zinc-950 border-zinc-800'}`}
                        >
                            <Text className={`font-bold ${type === 'expense' ? 'text-red-400' : 'text-zinc-500'}`}>Gasto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setType('income')}
                            className={`flex-1 py-3 rounded-xl items-center border ${type === 'income' ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-zinc-950 border-zinc-800'}`}
                        >
                            <Text className={`font-bold ${type === 'income' ? 'text-emerald-400' : 'text-zinc-500'}`}>Ingreso</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-zinc-400 text-xs font-semibold mb-2">Monto</Text>
                    <View className="flex-row mb-6 mt-1.5 items-center justify-center">
                        <TouchableOpacity onPress={() => setCurrency('NIO')} className={`px-3 py-1.5 rounded-l-lg border border-r-0 ${currency === 'NIO' ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-zinc-950 border-zinc-800'}`}>
                            <Text className={`font-bold text-sm ${currency === 'NIO' ? 'text-indigo-400' : 'text-zinc-500'}`}>C$</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCurrency('USD')} className={`px-3 py-1.5 rounded-r-lg border ${currency === 'USD' ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-zinc-950 border-zinc-800'}`}>
                            <Text className={`font-bold text-sm ${currency === 'USD' ? 'text-emerald-400' : 'text-zinc-500'}`}>$</Text>
                        </TouchableOpacity>
                        <TextInput
                            className="text-white text-4xl font-black ml-4 flex-1"
                            placeholder="0.00"
                            placeholderTextColor="#3f3f46"
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>

                    <Text className="text-zinc-400 text-xs font-semibold mb-2">Descripción</Text>
                    <View className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 mb-6">
                        <TextInput
                            className="text-white text-base"
                            placeholder="Ej. Compra súper"
                            placeholderTextColor="#52525b"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    {wallets.length > 0 && (
                        <View className="mb-6">
                            <Text className="text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-wider">Cuenta o Tarjeta de Pago</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {wallets.map(w => {
                                    const isSelected = walletId === w.id;
                                    return (
                                        <TouchableOpacity
                                            key={w.id}
                                            onPress={() => {
                                                setWalletId(w.id);
                                                setCurrency(w.currency as any);
                                            }}
                                            className={`mr-3 py-3 px-4 rounded-xl flex-row items-center border ${isSelected ? 'border-indigo-500 bg-indigo-600/20' : 'border-zinc-800 bg-zinc-900'}`}
                                        >
                                            <View className="mr-2">
                                                {w.type === 'credit_card' ? <icons.CreditCard size={18} color={isSelected ? "#818cf8" : "#a1a1aa"} /> : <icons.Landmark size={18} color={isSelected ? "#818cf8" : "#a1a1aa"} />}
                                            </View>
                                            <Text className={`font-semibold text-sm ${isSelected ? 'text-indigo-300' : 'text-zinc-400'}`}>{w.bank_name || 'Efectivo'} - {w.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )}

                    <Text className="text-zinc-400 text-xs font-semibold mb-2">Categoría</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setCategoryId(cat.id)}
                                className={`px-4 py-2.5 rounded-xl border mr-2 ${categoryId === cat.id ? 'bg-indigo-600 border-indigo-500' : 'bg-zinc-950 border-zinc-800'}`}
                            >
                                <Text className={`text-sm ${categoryId === cat.id ? 'text-white' : 'text-zinc-400'}`}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            <View className="px-5 pb-6">
                <TouchableOpacity
                    className={`w-full py-4 rounded-2xl items-center ${isSaving ? 'bg-indigo-600/50' : 'bg-indigo-600'}`}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <Text className="text-white font-bold text-base">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
} 
