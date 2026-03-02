import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useInsightsStore } from '@/stores/insights.store';
import { useFocusEffect, useRouter } from 'expo-router';
import * as icons from 'lucide-react-native';

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
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <ScrollView
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchInsightsDashboard(true)} tintColor="#818cf8" />}
            >
                <Text className="text-white text-3xl font-extrabold tracking-tight mb-6 mt-2">Asistente</Text>

                {/* Daily Insight */}
                {dashboard?.dailyInsight && (
                    <View className="bg-indigo-900/30 rounded-3xl p-5 mb-6 border border-indigo-500/30">
                        <View className="flex-row items-center mb-3">
                            <View className="w-9 h-9 bg-indigo-500/20 rounded-xl items-center justify-center mr-3">
                                <icons.Sparkles size={18} color="#818cf8" />
                            </View>
                            <Text className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Resumen de hoy</Text>
                        </View>
                        <Text className="text-white text-[15px] leading-relaxed">
                            {dashboard.dailyInsight.text}
                        </Text>
                    </View>
                )}

                {/* Alerts */}
                {dashboard?.alerts && dashboard.alerts.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Alertas</Text>
                        {dashboard.alerts.map((alert, idx) => (
                            <View key={idx} className="bg-red-950/30 rounded-2xl p-4 mb-3 border border-red-900/30 flex-row items-center">
                                <View className="w-9 h-9 bg-red-500/15 rounded-xl items-center justify-center mr-3">
                                    <icons.AlertTriangle size={18} color="#f87171" />
                                </View>
                                <Text className="text-red-200 flex-1 text-sm">{alert.text}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Recommended Action */}
                {dashboard?.recommendedAction && (
                    <View className="mb-6">
                        <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Tu Próximo Paso</Text>
                        <View className="bg-emerald-950/30 rounded-2xl p-4 border border-emerald-900/30 flex-row items-center">
                            <View className="w-9 h-9 bg-emerald-500/15 rounded-xl items-center justify-center mr-3">
                                <icons.Lightbulb size={18} color="#34d399" />
                            </View>
                            <Text className="text-emerald-200 flex-1 text-sm font-medium">{dashboard.recommendedAction.text}</Text>
                        </View>
                    </View>
                )}

                {/* Trends */}
                {dashboard?.trends && dashboard.trends.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Tendencias</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                            {dashboard.trends.map((trend, idx) => {
                                const isUp = (trend.text || '').includes('↑') || (trend.text || '').includes('subió');
                                return (
                                    <View key={idx} className="bg-zinc-900/80 rounded-2xl p-4 mr-3 border border-zinc-800 w-60">
                                        <View className="flex-row items-center mb-2">
                                            <View className={`w-8 h-8 rounded-xl items-center justify-center ${isUp ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                                {isUp
                                                    ? <icons.TrendingUp size={14} color="#f87171" />
                                                    : <icons.TrendingDown size={14} color="#34d399" />
                                                }
                                            </View>
                                        </View>
                                        <Text className="text-white text-sm">{trend.text}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* Goals */}
                <View className="mb-12">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Tus Metas</Text>
                        <TouchableOpacity onPress={() => router.push('/add-goal' as any)}>
                            <Text className="text-indigo-400 text-xs font-medium">+ Nueva</Text>
                        </TouchableOpacity>
                    </View>

                    {(!dashboard?.goals || dashboard.goals.length === 0) ? (
                        <Text className="text-zinc-600 text-sm italic">No tienes metas activas.</Text>
                    ) : (
                        dashboard.goals.map(goal => {
                            const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                            return (
                                <View key={goal.id} className="bg-zinc-900/80 rounded-2xl p-4 mb-3 border border-zinc-800">
                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="flex-row items-center flex-1 mr-2">
                                            <View className="w-8 h-8 bg-indigo-500/15 rounded-lg items-center justify-center mr-2.5">
                                                <icons.Target size={14} color="#818cf8" />
                                            </View>
                                            <Text className="text-white font-semibold text-sm" numberOfLines={1}>{goal.title}</Text>
                                        </View>
                                        <Text className="text-zinc-500 text-xs">
                                            {formatCurrency(goal.target_amount, goal.target_currency || 'NIO')}
                                        </Text>
                                    </View>
                                    <View className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-1">
                                        <View className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                                    </View>
                                    <Text className="text-zinc-600 text-[10px] text-right">{progress.toFixed(0)}%</Text>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            {/* Chatbot FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-600 rounded-2xl items-center justify-center shadow-lg shadow-emerald-900/50 border border-emerald-400/50"
                onPress={() => router.push('/chat' as any)}
                activeOpacity={0.8}
            >
                <icons.MessageCircle size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
