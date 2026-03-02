import { View, Text, TouchableOpacity } from 'react-native';
import { Insight } from '@/stores/insights.store';

export function InsightCard({ insight, onRead }: { insight: Insight, onRead: () => void }) {
    const getIconAndColor = () => {
        switch (insight.insight_type) {
            case 'spending_alert': return { icon: '⚠️', bg: 'bg-rose-900/20', border: 'border-rose-900/50', text: 'text-rose-400', title: 'Alerta de Gasto' };
            case 'saving_opportunity': return { icon: '💰', bg: 'bg-emerald-900/20', border: 'border-emerald-900/50', text: 'text-emerald-400', title: 'Oportunidad de Ahorro' };
            default: return { icon: '💡', bg: 'bg-indigo-900/20', border: 'border-indigo-900/50', text: 'text-indigo-400', title: 'Insight de IA' };
        }
    };

    const theme = getIconAndColor();

    return (
        <View className={`rounded-3xl p-5 mb-4 border ${theme.border} ${theme.bg}`}>
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                    <Text className="text-xl mr-2">{theme.icon}</Text>
                    <Text className={`font-bold ${theme.text}`}>{theme.title}</Text>
                </View>
                {!insight.is_read && (
                    <View className="w-2 h-2 rounded-full bg-indigo-500" />
                )}
            </View>

            <Text className="text-zinc-300 text-sm leading-relaxed mb-4">
                {insight.insight_text}
            </Text>

            {!insight.is_read && (
                <TouchableOpacity
                    className="bg-black/20 py-2 rounded-xl items-center self-start px-4 border border-white/5 active:bg-black/40"
                    onPress={onRead}
                >
                    <Text className="text-white text-xs font-semibold">Marcar como leído</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
