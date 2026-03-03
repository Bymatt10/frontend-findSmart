import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiClient } from '@/services/api';
import * as icons from 'lucide-react-native';

export default function EditBusinessTransactionScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // States
    const [productName, setProductName] = useState('');
    const [buyCost, setBuyCost] = useState('');
    const [extraCosts, setExtraCosts] = useState('');
    const [extraCostsDetail, setExtraCostsDetail] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO');
    const [isSold, setIsSold] = useState(false);

    useEffect(() => {
        if (!id) {
            router.back();
            return;
        }
        apiClient.get(`/business/${id}`).then(({ data }) => {
            const tx = data.data || data;
            setProductName(tx.product_name);
            setBuyCost(String(tx.buy_cost));
            setExtraCosts(tx.extra_costs ? String(tx.extra_costs) : '0');
            setExtraCostsDetail(tx.extra_costs_detail || '');
            setSellPrice(tx.sell_price ? String(tx.sell_price) : '');
            setCurrency(tx.currency || 'NIO');
            setIsSold(tx.status === 'sold');
        }).catch(() => {
            Alert.alert('Error', 'No se pudo cargar la transacción');
            router.back();
        }).finally(() => {
            setIsFetching(false);
        });
    }, [id]);

    const handleSave = async () => {
        if (!productName || !buyCost) {
            Alert.alert('Error', 'Por favor ingresa un nombre para el producto y su costo base');
            return;
        }

        setIsSaving(true);
        try {
            await apiClient.patch(`/business/${id}`, {
                product_name: productName,
                buy_cost: Number(buyCost),
                extra_costs: Number(extraCosts),
                extra_costs_detail: extraCostsDetail || null,
                sell_price: isSold && sellPrice ? Number(sellPrice) : null,
                status: isSold ? 'sold' : 'bought',
                currency
            });

            Alert.alert('Éxito', 'Modificación guardada', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo actualizar la transacción');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert("Eliminar", "¿Seguro quieres eliminar este registro por completo?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar", style: "destructive", onPress: async () => {
                    try {
                        await apiClient.delete(`/business/${id}`);
                        router.back();
                    } catch (e) {
                        Alert.alert('Error', 'No se pudo eliminar');
                    }
                }
            }
        ])
    }

    if (isFetching) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
                <ActivityIndicator size="large" color="#818cf8" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-900">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
                    <icons.ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Editar Producto</Text>
                <TouchableOpacity onPress={handleDelete} className="w-10 h-10 items-center justify-center">
                    <icons.Trash2 size={20} color="#f87171" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>

                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">Estado actual</Text>
                    <View className="flex-row justify-between items-center bg-zinc-900 p-4 rounded-2xl border border-zinc-800 mb-6 focus-within:border-indigo-500">
                        <Text className={`font-bold ${isSold ? 'text-emerald-400' : 'text-indigo-400'}`}>{isSold ? 'Producto Vendido' : 'En Inventario'}</Text>
                        <Switch
                            value={isSold}
                            onValueChange={setIsSold}
                            trackColor={{ false: '#3f3f46', true: '#34d399' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">Producto</Text>
                    <TextInput
                        className="bg-zinc-900 text-white p-4 rounded-2xl text-base mb-6 border border-zinc-800 focus:border-indigo-500"
                        placeholder="Nombre del producto"
                        placeholderTextColor="#52525b"
                        value={productName}
                        onChangeText={setProductName}
                    />

                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">Costo de compra principal</Text>
                    <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-1 mb-6 focus-within:border-indigo-500">
                        <Text className="text-zinc-400 font-bold text-lg">{currency === 'USD' ? '$' : 'C$'}</Text>
                        <TextInput
                            className="flex-1 text-white p-3 text-lg font-semibold"
                            keyboardType="numeric"
                            value={buyCost}
                            onChangeText={setBuyCost}
                        />
                    </View>

                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">Costos Extras Acumulados</Text>
                    <View className="flex-row mb-2">
                        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 flex-1 mr-2 focus-within:border-indigo-500 w-1/3">
                            <Text className="text-zinc-400 font-bold ">{currency === 'USD' ? '$' : 'C$'}</Text>
                            <TextInput
                                className="flex-1 text-white p-3 text-sm font-semibold"
                                keyboardType="numeric"
                                value={extraCosts}
                                onChangeText={setExtraCosts}
                            />
                        </View>
                        <TextInput
                            className="bg-zinc-900 text-white p-4 rounded-2xl text-sm border border-zinc-800 focus:border-indigo-500 flex-none w-2/3"
                            placeholder="Detalle (Ej. Envío o Zipper)"
                            placeholderTextColor="#52525b"
                            value={extraCostsDetail}
                            onChangeText={setExtraCostsDetail}
                        />
                    </View>
                    <View className="mb-6"></View>

                    {isSold && (
                        <>
                            <Text className="text-emerald-400 font-medium text-xs uppercase mb-3">Precio de venta</Text>
                            <View className="flex-row items-center bg-emerald-900/10 border border-emerald-900 rounded-2xl px-4 py-1 mb-8 focus-within:border-emerald-500">
                                <Text className="text-emerald-300 font-bold text-lg">{currency === 'USD' ? '$' : 'C$'}</Text>
                                <TextInput
                                    className="flex-1 text-white p-3 text-lg font-semibold"
                                    keyboardType="numeric"
                                    value={sellPrice}
                                    onChangeText={setSellPrice}
                                    placeholder="Introduce el monto en que lo vendiste"
                                />
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        className={`py-4 rounded-2xl items-center mb-[100px] ${isSaving ? 'bg-indigo-600/50' : 'bg-indigo-600'}`}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        <Text className="text-white font-bold text-base">{isSaving ? 'Guardando Cambios...' : 'Guardar Cambios'}</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
