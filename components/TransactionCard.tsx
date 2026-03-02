import { View, Text } from 'react-native';
import { CategoryIcon } from './CategoryIcon';

export interface Transaction {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: string;
    icon?: string;
    original_currency?: 'NIO' | 'USD';
}

const CATEGORY_COLORS: Record<string, string> = {
    'Alimentación': '#f97316',
    'Transporte': '#3b82f6',
    'Vivienda': '#8b5cf6',
    'Entretenimiento': '#ec4899',
    'Salud': '#10b981',
    'Educación': '#06b6d4',
    'Ropa': '#f43f5e',
    'Servicios': '#eab308',
    'Delivery': '#f59e0b',
    'Café': '#a16207',
    'Supermercado': '#22c55e',
    'Transferencias': '#6366f1',
    'Otros': '#71717a',
};

function getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category] || '#818cf8';
}

export function TransactionCard({ transaction }: { transaction: Transaction }) {
    const isExpense = transaction.amount < 0;
    const bgColor = getCategoryColor(transaction.category);

    return (
        <View className="flex-row items-center py-4 border-b border-zinc-800/50">
            {/* Colored icon circle */}
            <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: `${bgColor}15` }}
            >
                <CategoryIcon name={transaction.icon || 'MapPin'} size={22} color={bgColor} />
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-white font-semibold text-[15px]" numberOfLines={1}>{transaction.name}</Text>
                <Text className="text-zinc-500 text-xs mt-0.5">{transaction.category}</Text>
            </View>

            {/* Amount + Date */}
            <View className="items-end">
                <Text className={`font-bold text-[15px] ${isExpense ? 'text-white' : 'text-emerald-400'}`}>
                    {isExpense ? '-' : '+'}{transaction.original_currency === 'USD' ? '$' : 'C$'}{Math.abs(transaction.amount).toFixed(2)}
                </Text>
                <Text className="text-zinc-600 text-[10px] mt-0.5">{transaction.date}</Text>
            </View>
        </View>
    );
}
