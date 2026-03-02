import { View, Text, TouchableOpacity } from 'react-native';
import { Goal } from '@/stores/goals.store';
import * as icons from 'lucide-react-native';

const GOAL_ICONS: Record<string, any> = {
    default: icons.Target,
    home: icons.Home,
    car: icons.Car,
    plane: icons.Plane,
    book: icons.Book,
    gift: icons.Gift,
    heart: icons.Heart,
    shield: icons.Shield,
};

export function GoalCard({ goal, onAdd }: { goal: Goal, onAdd: () => void }) {
    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
    const isCompleted = goal.status === 'completed';
    const IconComp = GOAL_ICONS.default;
    const currSymbol = goal.target_currency === 'USD' ? '$' : 'C$';

    return (
        <View className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 mb-4">
            <View className="flex-row items-center mb-4">
                {/* Icon circle */}
                <View className="w-11 h-11 rounded-2xl bg-indigo-500/15 items-center justify-center mr-3">
                    {isCompleted
                        ? <icons.Lock size={20} color="#34d399" />
                        : <IconComp size={20} color="#818cf8" />
                    }
                </View>
                <View className="flex-1">
                    <Text className="text-white font-semibold text-base" numberOfLines={1}>{goal.title}</Text>
                    <Text className="text-zinc-500 text-xs mt-0.5">
                        Meta: {currSymbol}{Number(goal.target_amount).toLocaleString()}
                    </Text>
                </View>
                {isCompleted && (
                    <View className="bg-emerald-500/20 px-3 py-1 rounded-full">
                        <Text className="text-emerald-400 text-[10px] font-bold">✓ Completada</Text>
                    </View>
                )}
            </View>

            {/* Progress */}
            <View className="mb-2">
                <View className="flex-row justify-between mb-1.5">
                    <Text className="text-indigo-300 text-sm font-bold">
                        {currSymbol}{Number(goal.current_amount).toLocaleString()}
                    </Text>
                    <Text className="text-zinc-500 text-xs">{progress.toFixed(0)}%</Text>
                </View>
                <View className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <View
                        className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${progress}%` }}
                    />
                </View>
            </View>

            {!isCompleted && (
                <TouchableOpacity
                    className="mt-3 w-full bg-indigo-600/15 border border-indigo-500/30 py-3 rounded-2xl items-center active:bg-indigo-600/25"
                    onPress={onAdd}
                >
                    <Text className="text-indigo-400 font-semibold text-sm">+ Aportar</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
