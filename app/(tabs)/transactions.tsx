import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionCard } from '@/components/TransactionCard';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useState } from 'react';

export default function TransactionsScreen() {
    const [filter, setFilter] = useState('Todos');
    const { transactions, isLoading, fetchDashboardData, totalExpenses, totalIncome } = useDashboardStore();

    const filtered = transactions.filter(t =>
        filter === 'Todos' ? true :
            filter === 'Gastos' ? t.amount < 0 :
                t.amount > 0
    );

    const summaryAmount = filter === 'Ingresos' ? totalIncome : filter === 'Gastos' ? Math.abs(totalExpenses) : (totalIncome + totalExpenses);

    return (
        <SafeAreaView className="flex-1 bg-zinc-950 px-5 pt-2" edges={['top']}>
            {/* Header */}
            <Text className="text-white text-3xl font-extrabold tracking-tight mb-5 mt-2">Movimientos</Text>

            {/* Income / Expense Toggle */}
            <View className="flex-row bg-zinc-900 rounded-2xl p-1 mb-5 border border-zinc-800">
                {['Todos', 'Gastos', 'Ingresos'].map(f => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setFilter(f)}
                        className={`flex-1 py-2.5 rounded-xl items-center ${filter === f ? 'bg-indigo-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-sm font-semibold ${filter === f ? 'text-white' : 'text-zinc-500'}`}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Summary */}
            <View className="mb-5">
                <Text className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    {filter === 'Ingresos' ? 'Total Ingresos' : filter === 'Gastos' ? 'Total Gastos' : 'Balance Neto'}
                </Text>
                <Text className={`text-2xl font-black ${filter === 'Ingresos' ? 'text-emerald-400' : filter === 'Gastos' ? 'text-red-400' : 'text-white'}`}>
                    C${Math.abs(summaryAmount).toFixed(2)}
                </Text>
            </View>

            {/* Transaction List */}
            <View className="flex-1 bg-zinc-900/50 rounded-2xl px-4 border border-zinc-800/50">
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard transaction={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchDashboardData} tintColor="#818cf8" />
                    }
                    ListEmptyComponent={
                        <View className="items-center py-12">
                            <Text className="text-zinc-600 text-sm">No hay movimientos.</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}
