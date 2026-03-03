import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBusinessStore } from '@/stores/business.store';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as icons from 'lucide-react-native';

export function BusinessTransactions() {
    const router = useRouter();
    const [filter, setFilter] = useState<'Todos' | 'Inventario' | 'Vendidos'>('Todos');
    const { transactions, isLoading, fetchAll, stats } = useBusinessStore();

    const filtered = transactions.filter(t =>
        filter === 'Todos' ? true :
            filter === 'Inventario' ? t.status !== 'sold' :
                t.status === 'sold'
    );

    return (
        <SafeAreaView className="flex-1 bg-zinc-950 px-5 pt-2" edges={['top']}>
            {/* Header */}
            <Text className="text-white text-3xl font-extrabold tracking-tight mb-5 mt-2">Productos y Costos</Text>

            {/* Inventory / Sold Toggle */}
            <View className="flex-row bg-zinc-900 rounded-2xl p-1 mb-5 border border-zinc-800">
                {['Todos', 'Inventario', 'Vendidos'].map(f => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setFilter(f as any)}
                        className={`flex-1 py-2.5 rounded-xl items-center ${filter === f ? 'bg-indigo-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-sm font-semibold ${filter === f ? 'text-white' : 'text-zinc-500'}`}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Transaction List */}
            <View className="flex-1">
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchAll} tintColor="#818cf8" />
                    }
                    ListEmptyComponent={
                        <View className="items-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                            <Text className="text-zinc-500 text-sm">No hay registros.</Text>
                        </View>
                    }
                    renderItem={({ item: t }) => {
                        const totalInvested = Number(t.buy_cost) + Number(t.extra_costs);
                        const currencyStr = t.currency === 'USD' ? '$' : 'C$';
                        return (
                            <View className="bg-zinc-900/80 p-4 rounded-3xl border border-zinc-800 mb-3">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1 mr-3">
                                        <Text className="text-white font-bold text-base" numberOfLines={1}>{t.product_name}</Text>
                                        {t.extra_costs_detail ? (
                                            <Text className="text-zinc-500 text-xs mt-0.5">Extra: {t.extra_costs_detail} (+{currencyStr}{t.extra_costs})</Text>
                                        ) : null}
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className={`px-2 py-1 rounded-md ${t.status === 'sold' ? 'bg-emerald-500/20' : 'bg-indigo-500/20'} mr-3`}>
                                            <Text className={`text-[10px] font-bold uppercase ${t.status === 'sold' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                {t.status === 'sold' ? 'Vendido' : 'En Inventario'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => router.push(`/edit-business-transaction?id=${t.id}` as any)} className="p-1">
                                            <icons.Pencil size={18} color="#71717a" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View className="h-[1px] bg-zinc-800/80 my-3" />

                                <View className="flex-row justify-between">
                                    <View>
                                        <Text className="text-zinc-500 text-[10px] uppercase font-medium">Inversión</Text>
                                        <Text className="text-zinc-300 font-bold">{currencyStr}{totalInvested.toFixed(2)}</Text>
                                    </View>
                                    {t.status === 'sold' && (
                                        <>
                                            <View>
                                                <Text className="text-zinc-500 text-[10px] uppercase font-medium">Venta</Text>
                                                <Text className="text-zinc-300 font-bold">{currencyStr}{Number(t.sell_price).toFixed(2)}</Text>
                                            </View>
                                            <View className="items-end">
                                                <Text className="text-emerald-500/80 text-[10px] uppercase font-bold">Ganancia Neta</Text>
                                                <Text className="text-emerald-400 font-black">+{currencyStr}{Number(t.profit).toFixed(2)}</Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                                {t.status !== 'sold' && (
                                    <TouchableOpacity
                                        className="bg-indigo-600 rounded-xl py-2 mt-4 items-center"
                                        onPress={() => router.push(`/sell-business-transaction?id=${t.id}` as any)}
                                    >
                                        <Text className="text-white font-bold text-xs uppercase tracking-wide">Marcar Vendido</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
