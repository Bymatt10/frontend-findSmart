import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useGoalsStore } from '@/stores/goals.store';
import { GoalCard } from '@/components/GoalCard';
import * as icons from 'lucide-react-native';

export default function GoalsScreen() {
    const router = useRouter();
    const { goals, isLoading, fetchGoals, addProgress } = useGoalsStore();

    useEffect(() => {
        fetchGoals();
    }, []);

    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <ScrollView
                className="flex-1 bg-zinc-950 px-5 pt-2"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={() => fetchGoals(true)} tintColor="#818cf8" />
                }
            >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6 mt-2">
                    <View>
                        <Text className="text-white text-3xl font-extrabold tracking-tight">Mis Metas</Text>
                        <Text className="text-zinc-500 text-xs mt-1">Conquista tu futuro financiero</Text>
                    </View>
                    <TouchableOpacity
                        className="w-11 h-11 bg-indigo-600/20 rounded-2xl items-center justify-center border border-indigo-500/30"
                        onPress={() => router.push('/add-goal' as any)}
                    >
                        <icons.Plus size={20} color="#818cf8" />
                    </TouchableOpacity>
                </View>

                {/* Empty State */}
                {goals.length === 0 && !isLoading && (
                    <View className="items-center py-16">
                        <View className="w-20 h-20 bg-indigo-600/10 rounded-3xl items-center justify-center mb-4">
                            <icons.Target size={36} color="#818cf8" />
                        </View>
                        <Text className="text-white font-semibold text-lg mb-2">No tienes metas aún</Text>
                        <Text className="text-zinc-500 text-sm text-center mb-6 px-8">
                            Crea tu primera meta de ahorro y visualiza tu progreso día a día.
                        </Text>
                        <TouchableOpacity
                            className="bg-indigo-600 px-8 py-3.5 rounded-2xl"
                            onPress={() => router.push('/add-goal' as any)}
                        >
                            <Text className="text-white font-bold text-sm">Crear Meta</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Active Goals */}
                {activeGoals.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Activas</Text>
                        {activeGoals.map(goal => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onAdd={() => addProgress(goal.id, 100)}
                            />
                        ))}
                    </View>
                )}

                {/* Completed Goals */}
                {completedGoals.length > 0 && (
                    <View className="mb-24">
                        <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Completadas</Text>
                        {completedGoals.map(goal => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onAdd={() => { }}
                            />
                        ))}
                    </View>
                )}

                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}
