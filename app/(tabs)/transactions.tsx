import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { TransactionCard } from '@/components/TransactionCard';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useState } from 'react';

export default function TransactionsScreen() {
    const [filter, setFilter] = useState('Todos');
    const { transactions, isLoading, fetchDashboardData } = useDashboardStore();

    return (
        <View className="flex-1 bg-zinc-950 px-6 pt-6 -mt-2">

            {/* Header & Filter */}
            <View className="mb-6 mt-4">
                <Text className="text-white text-3xl font-extrabold tracking-tight mb-4">Movimientos</Text>

                <View className="flex-row">
                    {['Todos', 'Gastos', 'Ingresos'].map(f => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full mr-3 ${filter === f ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                        >
                            <Text className={`font-semibold ${filter === f ? 'text-white' : 'text-zinc-400'}`}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={transactions.filter(t =>
                    filter === 'Todos' ? true :
                        filter === 'Gastos' ? t.amount < 0 :
                            t.amount > 0
                )}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard transaction={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchDashboardData} tintColor="#6366f1" />
                }
            />
        </View>
    );
}

