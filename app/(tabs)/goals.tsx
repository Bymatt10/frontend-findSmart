import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useGoalsStore } from '@/stores/goals.store';
import { GoalCard } from '@/components/GoalCard';

export default function GoalsScreen() {
    const router = useRouter();
    const { goals, isLoading, fetchGoals, addProgress } = useGoalsStore();

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <ScrollView
            className="flex-1 bg-zinc-950 px-6 pt-6 -mt-2"
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={fetchGoals} tintColor="#6366f1" />
            }
        >
            <View className="flex-row justify-between items-end mb-8 mt-4">
                <View>
                    <Text className="text-white text-3xl font-extrabold tracking-tight">Mis Metas</Text>
                    <Text className="text-zinc-400 text-sm mt-1">Conquista tu futuro financiero</Text>
                </View>
                <TouchableOpacity
                    className="bg-indigo-600/20 w-10 h-10 rounded-full items-center justify-center border border-indigo-500/50"
                    onPress={() => router.push('/add-goal' as any)}
                >
                    <Text className="text-indigo-400 text-2xl" style={{ marginTop: -2 }}>+</Text>
                </TouchableOpacity>
            </View>

            <View className="pb-20">
                {goals.map(goal => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        onAdd={() => addProgress(goal.id, 100)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}
