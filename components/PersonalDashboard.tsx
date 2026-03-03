import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/auth.store';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useGoalsStore } from '@/stores/goals.store';
import { useCurrencyStore } from '@/stores/currency.store';
import { useRouter, useFocusEffect } from 'expo-router';
import { TransactionCard } from '@/components/TransactionCard';
import * as icons from 'lucide-react-native';

export function PersonalDashboard() {
    const { user } = useAuthStore();
    const { transactions, totalBalance, totalExpenses, totalIncome, isLoading, fetchDashboardData } = useDashboardStore();
    const { goals, fetchGoals } = useGoalsStore();
    const { currentRate, fetchRate } = useCurrencyStore();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
            fetchGoals();
            if (!currentRate) fetchRate();
        }, [])
    );

    const [currencyDisplay, setCurrencyDisplay] = useState<'NIO' | 'USD'>('NIO');

    const activeGoals = goals.filter(g => g.status === 'active');

    const formatAmount = (amount: number) => {
        if (currencyDisplay === 'USD' && currentRate) {
            return (amount / currentRate).toFixed(2);
        }
        return amount.toFixed(2);
    };

    return (
        <View className="flex-1 bg-zinc-950">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => { fetchDashboardData(); fetchRate(); }} tintColor="#818cf8" />}
            >
                {/* Hero Gradient — extends to the very top behind status bar */}
                <LinearGradient
                    colors={['#4338ca', '#7c3aed', '#6d28d9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingTop: insets.top + 12 }}
                    className="px-6 pb-7 rounded-b-3xl"
                >
                    <View className="flex-row justify-between items-center mb-1">
                        <View>
                            <Text className="text-indigo-200/80 text-xs font-medium">Hola,</Text>
                            <Text className="text-white text-xl font-bold">{user?.user_metadata?.name || 'Usuario'}</Text>
                        </View>
                        <TouchableOpacity
                            className="bg-white/15 px-3.5 py-1.5 rounded-full"
                            onPress={() => setCurrencyDisplay(currencyDisplay === 'NIO' ? 'USD' : 'NIO')}
                        >
                            <Text className="text-white text-xs font-bold">{currencyDisplay}</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-3 mb-5">
                        <Text className="text-indigo-200/60 text-xs mb-0.5">Balance</Text>
                        <Text className="text-white text-4xl font-black tracking-tight">
                            {currencyDisplay === 'USD' ? '$' : 'C$'}{formatAmount(Math.abs(totalBalance))}
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-white/15 rounded-full items-center justify-center mr-2">
                                <icons.TrendingUp size={14} color="#34d399" />
                            </View>
                            <View>
                                <Text className="text-indigo-200/60 text-[10px]">Ingresos</Text>
                                <Text className="text-emerald-300 font-bold text-sm">
                                    +{currencyDisplay === 'USD' ? '$' : 'C$'}{formatAmount(totalIncome)}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-white/15 rounded-full items-center justify-center mr-2">
                                <icons.TrendingDown size={14} color="#f87171" />
                            </View>
                            <View>
                                <Text className="text-indigo-200/60 text-[10px]">Gastos</Text>
                                <Text className="text-red-300 font-bold text-sm">
                                    {currencyDisplay === 'USD' ? '$' : 'C$'}{formatAmount(Math.abs(totalExpenses))}
                                </Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Quick Actions */}
                <View className="flex-row justify-between mx-5 mt-6 mb-6">
                    {[
                        { label: 'Registrar', Icon: icons.Plus, onPress: () => router.push('/add-transaction' as any) },
                        { label: 'Categorías', Icon: icons.LayoutGrid, onPress: () => router.push('/add-category' as any) },
                        { label: 'Metas', Icon: icons.Target, onPress: () => router.push('/(tabs)/goals' as any) },
                        { label: 'Chat IA', Icon: icons.MessageCircle, onPress: () => router.push('/chat' as any) },
                    ].map((action, idx) => (
                        <TouchableOpacity key={idx} className="items-center" onPress={action.onPress} activeOpacity={0.7}>
                            <View className="w-14 h-14 bg-indigo-600/15 border border-indigo-500/25 rounded-2xl items-center justify-center mb-2">
                                <action.Icon size={22} color="#818cf8" />
                            </View>
                            <Text className="text-zinc-400 text-[10px] font-medium">{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pockets / Active Goals */}
                {activeGoals.length > 0 && (
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mx-5 mb-3">
                            <Text className="text-white font-bold text-base">Mis Metas</Text>
                            <TouchableOpacity onPress={() => router.push('/(tabs)/goals' as any)}>
                                <Text className="text-indigo-400 text-xs font-medium">Ver Todas</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                            {activeGoals.slice(0, 4).map(goal => {
                                const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                                const currSymbol = goal.target_currency === 'USD' ? '$' : 'C$';
                                return (
                                    <View key={goal.id} className="w-40 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 mr-3">
                                        <View className="w-9 h-9 bg-indigo-500/15 rounded-xl items-center justify-center mb-3">
                                            <icons.Target size={18} color="#818cf8" />
                                        </View>
                                        <Text className="text-white text-sm font-semibold mb-0.5" numberOfLines={1}>{goal.title}</Text>
                                        <Text className="text-zinc-500 text-[10px] mb-3">Meta: {currSymbol}{Number(goal.target_amount).toLocaleString()}</Text>
                                        <View className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-1">
                                            <View className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                                        </View>
                                        <Text className="text-zinc-600 text-[10px] text-right">{progress.toFixed(0)}%</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* Recent Transactions */}
                <View className="mx-5 mb-24">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white font-bold text-base">Últimos Movimientos</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                            <Text className="text-indigo-400 text-xs font-medium">Ver todos</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-zinc-900/50 rounded-2xl px-4 border border-zinc-800/50">
                        {transactions.length === 0 && !isLoading ? (
                            <Text className="text-zinc-500 text-center py-8">No hay movimientos recientes.</Text>
                        ) : (
                            transactions.map((t, idx) => (
                                <TransactionCard
                                    key={t.id}
                                    transaction={t}
                                    onEdit={() => router.push(`/edit-transaction?id=${t.id}` as any)}
                                />
                            ))
                        )}
                    </View>
                </View>

            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-lg shadow-indigo-900/50 border border-indigo-400/50"
                onPress={() => router.push('/add-transaction' as any)}
                activeOpacity={0.8}
            >
                <icons.Plus size={26} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}
