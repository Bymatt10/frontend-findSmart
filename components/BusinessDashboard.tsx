import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useBusinessStore } from '@/stores/business.store';
import { useRouter, useFocusEffect } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import * as icons from 'lucide-react-native';

const screenWidth = Dimensions.get("window").width;

export function BusinessDashboard() {
    const { transactions, stats, isLoading, fetchAll, fetchStats } = useBusinessStore();
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            fetchAll();
            fetchStats();
        }, [])
    );

    const onRefresh = () => {
        fetchAll();
        fetchStats();
    };

    const profitDataValues = Object.values(stats.profitByMonth);
    const profitLabels = Object.keys(stats.profitByMonth).map(m => m.split('-')[1]);

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <View className="flex-1">
                <ScrollView
                    className="flex-1 px-5 pt-2"
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#818cf8" />}
                >
                    <View className="flex-row justify-between items-center mb-6 mt-2">
                        <View>
                            <Text className="text-white text-3xl font-extrabold tracking-tight">Mi Negocio</Text>
                            <Text className="text-emerald-400/80 text-xs mt-1">Ingresos, Inversión y Control</Text>
                        </View>
                    </View>

                    {/* Targetas de Estadisticas */}
                    <View className="flex-row space-x-3 mb-6">
                        <View className="flex-1 bg-emerald-900/30 border border-emerald-900/50 p-4 rounded-3xl mr-2">
                            <View className="w-8 h-8 rounded-full items-center justify-center bg-emerald-500/20 mb-3">
                                <icons.TrendingUp size={14} color="#34d399" />
                            </View>
                            <Text className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Ganancia Neta</Text>
                            <Text className="text-white text-lg font-black tracking-tighter">C${stats.netProfit.toFixed(2)}</Text>
                        </View>
                        <View className="flex-1 bg-indigo-900/30 border border-indigo-900/50 p-4 rounded-3xl ml-1">
                            <View className="w-8 h-8 rounded-full items-center justify-center bg-indigo-500/20 mb-3">
                                <icons.PackageOpen size={14} color="#818cf8" />
                            </View>
                            <Text className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Inventario Actual</Text>
                            <Text className="text-white text-lg font-black tracking-tighter">C${stats.inventoryValue.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Grafico */}
                    {profitDataValues.length > 0 && (
                        <View className="mb-6">
                            <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Ganancia por Mes</Text>
                            <View className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden py-3">
                                <BarChart
                                    data={{
                                        labels: profitLabels.length ? profitLabels : ['...'],
                                        datasets: [{ data: profitDataValues.length ? profitDataValues : [0] }]
                                    }}
                                    width={screenWidth - 40}
                                    height={220}
                                    yAxisLabel="C$"
                                    yAxisSuffix=""
                                    chartConfig={{
                                        backgroundColor: 'transparent',
                                        backgroundGradientFrom: '#18181b', // zinc-900
                                        backgroundGradientTo: '#18181b',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`, // emerald-400
                                        labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`, // zinc-400
                                        barPercentage: 0.6,
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    {/* Lista Transacciones Recientes (Solo 3) */}
                    <View className="flex-row justify-between items-center mb-3 mt-4">
                        <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Últimos Registros</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                            <Text className="text-indigo-400 font-medium text-[10px] uppercase">Ver Todos</Text>
                        </TouchableOpacity>
                    </View>

                    {transactions.length === 0 ? (
                        <View className="items-center py-10">
                            <Text className="text-zinc-500">No hay registros de compras ni ventas.</Text>
                        </View>
                    ) : (
                        transactions.slice(0, 3).map(t => {
                            const totalInvested = Number(t.buy_cost) + Number(t.extra_costs);
                            const currencyStr = t.currency === 'USD' ? '$' : 'C$';
                            return (
                                <View key={t.id} className="bg-zinc-900/80 p-4 rounded-3xl border border-zinc-800 mb-3">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="flex-1 mr-3">
                                            <Text className="text-white font-bold text-base" numberOfLines={1}>{t.product_name}</Text>
                                            {t.extra_costs_detail ? (
                                                <Text className="text-zinc-500 text-xs mt-0.5" numberOfLines={1}>Ext: {t.extra_costs_detail}</Text>
                                            ) : null}
                                        </View>
                                        <View className="flex-row items-center">
                                            <View className={`px-2 py-1 rounded-md ${t.status === 'sold' ? 'bg-emerald-500/20' : 'bg-indigo-500/20'} mr-3`}>
                                                <Text className={`text-[10px] font-bold uppercase ${t.status === 'sold' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                    {t.status === 'sold' ? 'Vendido' : 'En Inventario'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between mt-2">
                                        <Text className="text-zinc-400 font-medium text-xs">Inv: {currencyStr}{totalInvested.toFixed(0)}</Text>
                                        {t.status === 'sold' && (
                                            <Text className="text-emerald-400 font-bold text-xs">Ganancia: +{currencyStr}{Number(t.profit).toFixed(0)}</Text>
                                        )}
                                    </View>
                                </View>
                            )
                        })
                    )}

                    <View className="h-24" />
                </ScrollView>
            </View>

            {/*  FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-600 rounded-2xl items-center justify-center shadow-lg shadow-emerald-900/50 border border-emerald-400/50"
                onPress={() => router.push('/add-business-transaction' as any)}
                activeOpacity={0.8}
            >
                <icons.Plus size={26} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
