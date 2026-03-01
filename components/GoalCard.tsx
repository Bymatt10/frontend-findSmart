import { View, Text, TouchableOpacity } from 'react-native';
import { Goal } from '@/stores/goals.store';

export function GoalCard({ goal, onAdd }: { goal: Goal, onAdd: () => void }) {
    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
    const isCompleted = goal.status === 'completed';

    return (
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-4">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-lg font-bold">{goal.title}</Text>
                {isCompleted && (
                    <View className="bg-emerald-500/20 px-3 py-1 rounded-full">
                        <Text className="text-emerald-400 text-xs font-bold">Completada</Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-end mb-4">
                <Text className="text-indigo-400 text-2xl font-black">{goal.target_currency === 'USD' ? '$' : 'C$'}{goal.current_amount}</Text>
                <Text className="text-zinc-500 text-sm font-medium ml-1 mb-1">/ {goal.target_currency === 'USD' ? '$' : 'C$'}{goal.target_amount}</Text>
            </View>

            {/* Progress Bar */}
            <View className="h-3 bg-zinc-800 rounded-full overflow-hidden mb-4">
                <View
                    className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${progress}%` }}
                />
            </View>

            {!isCompleted && (
                <TouchableOpacity
                    className="w-full bg-zinc-800 py-3 rounded-xl items-center active:bg-zinc-700"
                    onPress={onAdd}
                >
                    <Text className="text-white font-semibold">Aportar a la meta</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
