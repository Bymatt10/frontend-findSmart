import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useDashboardStore } from '@/stores/dashboard.store';
import { supabase } from '@/services/supabase';
import { useRouter, useFocusEffect } from 'expo-router';
import { TransactionCard } from '@/components/TransactionCard';
import { ExpensePieChart } from '@/components/Chart';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { transactions, totalBalance, totalExpenses, totalIncome, isLoading, fetchDashboardData } = useDashboardStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const [currencyDisplay, setCurrencyDisplay] = useState<'NIO' | 'USD'>('NIO');

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView
        className="flex-1 px-6 pt-6"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchDashboardData()} tintColor="#6366f1" />}
      >

        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-zinc-400 text-sm">Bienvenido de vuelta,</Text>
            <Text className="text-white text-2xl font-bold">{user?.user_metadata?.name || 'Usuario'}</Text>
          </View>
          <TouchableOpacity
            className="bg-zinc-900 p-3 rounded-full border border-zinc-800"
            onPress={handleLogout}
          >
            <Text className="text-zinc-300 text-xs font-semibold">Salir</Text>
          </TouchableOpacity>
        </View>

        {/* Main Card (Balance/Expense) */}
        <View className="bg-gradient-to-br from-indigo-900 to-indigo-600 rounded-3xl p-6 mb-8 border border-indigo-500 shadow-xl shadow-indigo-900/20">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-indigo-200 text-sm font-medium">Balance Total</Text>
            <TouchableOpacity
              className="bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-400/30"
              onPress={() => setCurrencyDisplay(currencyDisplay === 'NIO' ? 'USD' : 'NIO')}
            >
              <Text className="text-indigo-200 text-xs font-bold">{currencyDisplay}</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-white text-5xl font-black mb-6 tracking-tighter">
            {currencyDisplay === 'USD' ? '$' : 'C$'}{Math.abs(totalBalance).toFixed(2)}
          </Text>

          <View className="flex-row justify-between pt-4 border-t border-indigo-500/30">
            <View>
              <Text className="text-indigo-200 text-xs">Ingresos</Text>
              <Text className="text-emerald-400 font-semibold mt-1">
                +{currencyDisplay === 'USD' ? '$' : 'C$'}{totalIncome.toFixed(2)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-indigo-200 text-xs">Gastos</Text>
              <Text className="text-red-400 font-semibold mt-1">
                {currencyDisplay === 'USD' ? '$' : 'C$'}{Math.abs(totalExpenses).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-bold">Últimos Movimientos</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text className="text-indigo-400 text-sm font-medium">Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-24">
          {transactions.length === 0 && !isLoading ? (
            <Text className="text-zinc-500 text-center mt-4">No hay movimientos recientes.</Text>
          ) : (
            transactions.map(t => (
              <TransactionCard key={t.id} transaction={t} />
            ))
          )}
        </View>

      </ScrollView>

      {/* FAB (Floating Action Button) */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg shadow-indigo-900/50 border border-indigo-400"
        onPress={() => router.push('/add-transaction' as any)}
      >
        <Text className="text-white text-3xl font-light" style={{ marginTop: -2 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
