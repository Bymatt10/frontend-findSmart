import { View, Text } from 'react-native';

export interface Transaction {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: string;
    icon?: string;
    original_currency?: 'NIO' | 'USD';
}

export function TransactionCard({ transaction }: { transaction: Transaction }) {
    const isExpense = transaction.amount < 0;

    return (
        <View className="flex-row items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 mb-3">
            <View className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mr-4">
                <Text className="text-xl">{transaction.icon || '📌'}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-white font-medium text-base line-clamp-1">{transaction.name}</Text>
                <Text className="text-zinc-500 text-xs">{transaction.category} • {transaction.date}</Text>
            </View>
            <Text className={`font-bold text-base ${isExpense ? 'text-white' : 'text-emerald-400'}`}>
                {isExpense ? '-' : '+'}{transaction.original_currency === 'USD' ? '$' : 'C$'}{Math.abs(transaction.amount).toFixed(2)}
            </Text>
        </View>
    );
}
