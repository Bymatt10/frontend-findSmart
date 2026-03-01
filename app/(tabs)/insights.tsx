import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useCallback } from 'react';
import { useInsightsStore } from '@/stores/insights.store';
import { useFocusEffect, useRouter } from 'expo-router';
import { IconBulb, IconChart, IconFlag, IconUser } from '@/components/LineIcons';

export default function InsightsScreen() {
    const { dashboard, isLoading, fetchInsightsDashboard } = useInsightsStore();
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            fetchInsightsDashboard();
        }, [])
    );

    const formatCurrency = (amount: number, currency: string) => {
        return `${currency === 'USD' ? '$' : 'C$'}${Math.abs(amount).toFixed(2)}`;
    };

    return (
        <View className="flex-1 bg-zinc-950">
            <ScrollView
                className="flex-1 px-6 pt-6"
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchInsightsDashboard} tintColor="#818cf8" />}
            >
                <Text className="text-white text-3xl font-bold mb-6">Asistente</Text>

                {/* Daily Insight */}
                {dashboard?.dailyInsight && (
                    <View className="bg-indigo-900/40 rounded-3xl p-6 mb-8 border border-indigo-500/50 shadow-xl shadow-indigo-900/20">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-indigo-500/20 p-2 rounded-full mr-3">
                                <IconBulb size={24} color="#818cf8" />
                            </View>
                            <Text className="text-indigo-300 font-semibold uppercase text-xs tracking-widest">Resumen de hoy</Text>
                        </View>
                        <Text className="text-white text-lg font-medium leading-relaxed">
                            {dashboard.dailyInsight.text}
                        </Text>
                    </View>
                )}

                {/* Alertas Inteligentes */}
                {dashboard?.alerts && dashboard.alerts.length > 0 && (
                    <View className="mb-8">
                        <Text className="text-zinc-400 font-bold mb-4 uppercase text-xs tracking-wider">Desviaciones Críticas</Text>
                        {dashboard.alerts.map((alert, idx) => (
                            <View key={idx} className="bg-red-950/40 rounded-2xl p-4 mb-3 border border-red-900/50 flex-row items-center">
                                <Text className="text-2xl mr-3">⚠️</Text>
                                <Text className="text-red-200 flex-1 text-sm">{alert.text}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Acción Recomendada */}
                {dashboard?.recommendedAction && (
                    <View className="mb-8">
                        <Text className="text-zinc-400 font-bold mb-4 uppercase text-xs tracking-wider">Tu Próximo Paso</Text>
                        <TouchableOpacity className="bg-emerald-950/40 rounded-2xl p-5 border border-emerald-900/50 flex-row items-center">
                            <Text className="text-3xl mr-4">💡</Text>
                            <Text className="text-emerald-200 flex-1 font-medium">{dashboard.recommendedAction.text}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Tendencias */}
                {dashboard?.trends && dashboard.trends.length > 0 && (
                    <View className="mb-8">
                        <Text className="text-zinc-400 font-bold mb-4 uppercase text-xs tracking-wider">Comportamiento Reciente</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                            {dashboard.trends.map((trend, idx) => {
                                const isUp = (trend.text || '').includes('↑') || (trend.text || '').includes('subió');
                                return (
                                    <View key={idx} className="bg-zinc-900 rounded-2xl p-5 mr-3 border border-zinc-800 w-64">
                                        <View className="flex-row items-center mb-2">
                                            <View className={`w-8 h-8 rounded-full items-center justify-center ${isUp ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                                <IconChart size={16} color={isUp ? "#f87171" : "#34d399"} />
                                            </View>
                                        </View>
                                        <Text className="text-white text-sm font-medium">{trend.text}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* Metas Activas (moved from Goals Tab) */}
                <View className="mb-12">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-zinc-400 font-bold uppercase text-xs tracking-wider">Tus Metas</Text>
                        <TouchableOpacity onPress={() => router.push('/add-goal' as any)}>
                            <Text className="text-indigo-400 text-sm font-medium">+ Nueva</Text>
                        </TouchableOpacity>
                    </View>

                    {(!dashboard?.goals || dashboard.goals.length === 0) ? (
                        <Text className="text-zinc-600 text-sm italic">No tienes metas activas. Crear una ayuda a mantener el enfoque.</Text>
                    ) : (
                        dashboard.goals.map(goal => {
                            const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                            return (
                                <View key={goal.id} className="bg-zinc-900 rounded-2xl p-5 mb-3 border border-zinc-800">
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-white font-semibold flex-1 mr-2" numberOfLines={1}>{goal.title}</Text>
                                        <View className="bg-zinc-800 px-2 py-1 rounded">
                                            <Text className="text-zinc-400 text-xs font-medium">
                                                {formatCurrency(goal.target_amount, goal.target_currency || 'NIO')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
                                        <View className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                                    </View>
                                    <Text className="text-zinc-500 text-xs text-right">{progress.toFixed(0)}% completado</Text>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            {/* Chatbot FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-16 h-16 bg-emerald-600 rounded-full items-center justify-center shadow-lg shadow-emerald-900/50 border border-emerald-400"
                onPress={() => router.push('/chat' as any)}
            >
                <Text className="text-2xl pt-1">💬</Text>
            </TouchableOpacity>
        </View >
    );
}
