import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { apiClient } from '@/services/api';
import * as icons from 'lucide-react-native';

export default function AddBusinessTransactionScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // States
    const [productName, setProductName] = useState('');
    const [buyCost, setBuyCost] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO');

    // Lista dinámica de costos extra
    const [extraCostsList, setExtraCostsList] = useState([{ id: 1, amount: '', detail: '' }]);

    const addExtraCostRow = () => {
        setExtraCostsList([...extraCostsList, { id: Date.now(), amount: '', detail: '' }]);
    };

    const removeExtraCostRow = (id: number) => {
        setExtraCostsList(extraCostsList.filter(item => item.id !== id));
    };

    const handleExtraCostChange = (id: number, field: 'amount' | 'detail', value: string) => {
        const updatedList = extraCostsList.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setExtraCostsList(updatedList);
    };

    const handleSave = async () => {
        if (!productName || !buyCost) {
            Alert.alert('Error', 'Por favor ingresa un nombre para el producto y su costo de compra');
            return;
        }

        // Calcular la suma de todos los costos extra y concatenar los detalles
        let totalExtraCosts = 0;
        let detailsString = '';

        extraCostsList.forEach(item => {
            const amount = Number(item.amount);
            if (!isNaN(amount) && amount > 0) {
                totalExtraCosts += amount;
                if (item.detail) {
                    detailsString += `${item.detail} (${amount}), `;
                } else {
                    detailsString += `Sin detalle (${amount}), `;
                }
            }
        });

        // Eliminar coma final
        if (detailsString.endsWith(', ')) {
            detailsString = detailsString.slice(0, -2);
        }

        setIsLoading(true);
        try {
            await apiClient.post('/business', {
                product_name: productName,
                buy_cost: Number(buyCost),
                extra_costs: totalExtraCosts,
                extra_costs_detail: detailsString || undefined,
                sell_price: sellPrice ? Number(sellPrice) : undefined,
                currency
            });

            Alert.alert('Éxito', 'Transacción guardada correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo guardar la transacción');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <View className="flex-row items-center px-4 py-3 border-b border-zinc-900">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
                    <icons.ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold ml-2">Registrar Producto</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>

                    {/* Moneda */}
                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">Moneda</Text>
                    <View className="flex-row space-x-3 mb-6">
                        {['NIO', 'USD'].map((c) => (
                            <TouchableOpacity
                                key={c}
                                className={`flex-1 py-3 rounded-2xl items-center border ${currency === c ? 'bg-indigo-600 border-indigo-500' : 'bg-zinc-900 border-zinc-800'}`}
                                onPress={() => setCurrency(c as 'NIO' | 'USD')}
                            >
                                <Text className={`font-bold ${currency === c ? 'text-white' : 'text-zinc-400'}`}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Producto */}
                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">Producto</Text>
                    <TextInput
                        className="bg-zinc-900 text-white p-4 rounded-2xl text-base mb-6 border border-zinc-800 focus:border-indigo-500"
                        placeholder="Ej. Pantalón Jean talla 32"
                        placeholderTextColor="#52525b"
                        value={productName}
                        onChangeText={setProductName}
                    />

                    {/* Costo de Compra */}
                    <Text className="text-zinc-400 font-medium text-xs uppercase mb-3">Costo de compra principal</Text>
                    <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-1 mb-6 focus-within:border-indigo-500">
                        <Text className="text-zinc-400 font-bold text-lg">{currency === 'USD' ? '$' : 'C$'}</Text>
                        <TextInput
                            className="flex-1 text-white p-3 text-lg font-semibold"
                            placeholder="0.00"
                            placeholderTextColor="#52525b"
                            keyboardType="numeric"
                            value={buyCost}
                            onChangeText={setBuyCost}
                        />
                    </View>

                    {/* Costos extra Dinámicos */}
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-zinc-400 font-medium text-xs uppercase">Costos Extras Adicionales</Text>
                        <TouchableOpacity onPress={addExtraCostRow} className="flex-row items-center bg-indigo-500/20 px-2 py-1 rounded-lg">
                            <icons.Plus size={12} color="#818cf8" />
                            <Text className="text-indigo-400 text-[10px] font-bold ml-1 uppercase">Agregar Nuevo</Text>
                        </TouchableOpacity>
                    </View>

                    {extraCostsList.map((item, index) => (
                        <View key={item.id} className="flex-row items-center mb-3">
                            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-3 flex-1 mr-2 focus-within:border-indigo-500 w-1/3">
                                <Text className="text-zinc-400 font-bold ">{currency === 'USD' ? '$' : 'C$'}</Text>
                                <TextInput
                                    className="flex-1 text-white p-3 text-sm font-semibold"
                                    placeholder="0"
                                    placeholderTextColor="#52525b"
                                    keyboardType="numeric"
                                    value={item.amount}
                                    onChangeText={(val) => handleExtraCostChange(item.id, 'amount', val)}
                                />
                            </View>
                            <TextInput
                                className="bg-zinc-900 text-white p-4 rounded-2xl text-sm border border-zinc-800 focus:border-indigo-500 flex-1 mr-2"
                                placeholder="Detalle (Ej. Envío)"
                                placeholderTextColor="#52525b"
                                value={item.detail}
                                onChangeText={(val) => handleExtraCostChange(item.id, 'detail', val)}
                            />
                            {/* Mostrar botón de eliminar si hay más de 1 campo de costo extra */}
                            {extraCostsList.length > 1 && (
                                <TouchableOpacity onPress={() => removeExtraCostRow(item.id)} className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 items-center justify-center">
                                    <icons.Trash2 size={16} color="#f87171" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <View className="mb-6"></View>

                    {/* Precio de venta */}
                    <Text className="text-indigo-400 font-medium text-xs uppercase mb-3">Precio de venta (Si ya se vendió)</Text>
                    <View className="flex-row items-center bg-indigo-900/30 border border-indigo-900 rounded-2xl px-4 py-1 mb-8 focus-within:border-indigo-500">
                        <Text className="text-indigo-300 font-bold text-lg">{currency === 'USD' ? '$' : 'C$'}</Text>
                        <TextInput
                            className="flex-1 text-white p-3 text-lg font-semibold"
                            placeholder="Opcional"
                            placeholderTextColor="#52525b"
                            keyboardType="numeric"
                            value={sellPrice}
                            onChangeText={setSellPrice}
                        />
                    </View>

                    {/* Botón Guardar */}
                    <TouchableOpacity
                        className={`py-4 rounded-2xl items-center mb-10 ${isLoading ? 'bg-indigo-600/50' : 'bg-indigo-600'}`}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text className="text-white font-bold text-base">{isLoading ? 'Guardando...' : 'Guardar Producto'}</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
