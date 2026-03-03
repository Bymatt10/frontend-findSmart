import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiClient } from '@/services/api';
import * as icons from 'lucide-react-native';

export default function SellBusinessTransactionScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Original data state
    const [originalTx, setOriginalTx] = useState<any>(null);

    // Form state
    const [sellPrice, setSellPrice] = useState('');
    const [newExtraCost, setNewExtraCost] = useState('');
    const [newExtraCostDetail, setNewExtraCostDetail] = useState('');

    useEffect(() => {
        if (!id) {
            Alert.alert('Error', 'No se ha encontrado el producto');
            router.back();
            return;
        }

        const fetchTx = async () => {
            try {
                const { data } = await apiClient.get(`/business/${id}`);
                setOriginalTx(data.data || data);
            } catch (error) {
                Alert.alert('Error', 'No se pudo cargar el producto');
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        fetchTx();
    }, [id]);

    const handleSave = async () => {
        if (!sellPrice) {
            Alert.alert('Atención', 'Ingresa el monto por el que vendiste el producto');
            return;
        }

        setIsSaving(true);
        try {
            // Compute combined extra costs
            let finalExtraCosts = Number(originalTx.extra_costs || 0);
            let finalExtraCostsDetail = originalTx.extra_costs_detail || '';

            const addedExtraCost = Number(newExtraCost);
            if (!isNaN(addedExtraCost) && addedExtraCost > 0) {
                finalExtraCosts += addedExtraCost;

                const detailStr = newExtraCostDetail ? newExtraCostDetail : 'Gasto venta';
                if (finalExtraCostsDetail) {
                    finalExtraCostsDetail += `, ${detailStr} (${addedExtraCost})`;
                } else {
                    finalExtraCostsDetail = `${detailStr} (${addedExtraCost})`;
                }
            }

            // Actualizar 
            await apiClient.patch(`/business/${id}`, {
                sell_price: Number(sellPrice),
                status: 'sold',
                extra_costs: finalExtraCosts,
                extra_costs_detail: finalExtraCostsDetail,
            });

            Alert.alert('¡Excelente!', 'Su producto ha sido marcado como VENDIDO. Ganancia registrada exitosamente.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo registrar la venta.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
                <ActivityIndicator size="large" color="#818cf8" />
            </SafeAreaView>
        );
    }

    const cSymbol = originalTx?.currency === 'USD' ? '$' : 'C$';

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <View className="flex-row items-center px-4 py-3 border-b border-zinc-900">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
                    <icons.ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold ml-2">Marcar Vendido</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>

                    {/* Info Resumen */}
                    <View className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 mb-6">
                        <Text className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Producto a vender</Text>
                        <Text className="text-white text-lg font-bold mb-3">{originalTx?.product_name}</Text>

                        <View className="flex-row">
                            <View className="mr-6">
                                <Text className="text-zinc-500 text-[10px] uppercase">Costo Base</Text>
                                <Text className="text-zinc-300 font-bold">{cSymbol}{Number(originalTx?.buy_cost).toFixed(2)}</Text>
                            </View>
                            <View>
                                <Text className="text-zinc-500 text-[10px] uppercase">Extras guardados</Text>
                                <Text className="text-zinc-300 font-bold">{cSymbol}{Number(originalTx?.extra_costs || 0).toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3 text-center">Detalles de la operación</Text>

                    {/* Precio de venta */}
                    <Text className="text-emerald-400 font-medium text-xs uppercase mb-3 mt-4">¿Por cuánto lo vendiste?</Text>
                    <View className="flex-row items-center bg-emerald-900/20 border border-emerald-900/50 rounded-2xl px-4 py-1 mb-6 focus-within:border-emerald-500">
                        <Text className="text-emerald-300 font-bold text-lg">{cSymbol}</Text>
                        <TextInput
                            className="flex-1 text-white p-3 text-lg font-black"
                            placeholder="0.00"
                            placeholderTextColor="#52525b"
                            keyboardType="numeric"
                            value={sellPrice}
                            onChangeText={setSellPrice}
                            autoFocus
                        />
                    </View>

                    <View className="h-[1px] bg-zinc-900 my-4" />

                    {/* Costos extra al momento de vender */}
                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">¿Tuviste algún gasto extra en esta venta? (Opcional)</Text>
                    <View className="flex-row mb-8">
                        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 flex-1 mr-2 focus-within:border-indigo-500 w-1/3">
                            <Text className="text-zinc-400 font-bold ">{cSymbol}</Text>
                            <TextInput
                                className="flex-1 text-white p-3 text-sm font-semibold"
                                placeholder="0"
                                placeholderTextColor="#52525b"
                                keyboardType="numeric"
                                value={newExtraCost}
                                onChangeText={setNewExtraCost}
                            />
                        </View>
                        <TextInput
                            className="bg-zinc-900 text-white p-4 rounded-2xl text-sm border border-zinc-800 focus:border-indigo-500 flex-1 ml-2"
                            placeholder="Ej. Delivery, Etiqueta..."
                            placeholderTextColor="#52525b"
                            value={newExtraCostDetail}
                            onChangeText={setNewExtraCostDetail}
                        />
                    </View>

                    {/* Botón Guardar */}
                    <TouchableOpacity
                        className={`py-4 rounded-2xl items-center mb-10 ${isSaving ? 'bg-emerald-600/50' : 'bg-emerald-600'}`}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        <Text className="text-white font-bold text-base">{isSaving ? 'Guardando Venta...' : 'CONFIRMAR VENTA'}</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
