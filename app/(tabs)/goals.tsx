import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useGoalsStore } from '@/stores/goals.store';
import { useWalletsStore } from '@/stores/wallets.store';
import { GoalCard } from '@/components/GoalCard';
import * as icons from 'lucide-react-native';

export default function GoalsScreen() {
    const router = useRouter();
    const { goals, isLoading, fetchGoals, addProgress } = useGoalsStore();
    const { wallets, fetchWallets } = useWalletsStore();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchGoals();
        fetchWallets();
    }, []);

    const openContributionModal = (goalId: string) => {
        setSelectedGoalId(goalId);
        setAmount('');
        if (wallets.length > 0) setSelectedWalletId(wallets[0].id);
        setIsModalVisible(true);
    };

    const handleContribute = async () => {
        if (!selectedGoalId || !amount || isNaN(Number(amount))) {
            return Alert.alert('Error', 'Ingresa un monto válido.');
        }

        setIsSubmitting(true);
        await addProgress(selectedGoalId, Number(amount));
        setIsSubmitting(false);
        setIsModalVisible(false);
    };

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
                                onAdd={openContributionModal}
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

            {/* Modal para aportar */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-zinc-900 rounded-t-3xl p-6 border-t border-zinc-800">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">Aportar a Meta</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} className="w-8 h-8 bg-zinc-800 rounded-full items-center justify-center">
                                <icons.X size={18} color="#a1a1aa" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-zinc-400 text-xs font-semibold mb-2">Monto a agregar</Text>
                        <View className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 mb-6">
                            <TextInput
                                className="text-white text-base"
                                placeholder="0.00"
                                placeholderTextColor="#52525b"
                                keyboardType="decimal-pad"
                                value={amount}
                                onChangeText={setAmount}
                                autoFocus
                            />
                        </View>

                        {wallets.length > 0 && (
                            <>
                                <Text className="text-zinc-400 text-xs font-semibold mb-2">Desde billetera (Opcional)</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-12">
                                    {wallets.map(w => (
                                        <TouchableOpacity
                                            key={w.id}
                                            onPress={() => setSelectedWalletId(w.id)}
                                            className={`px-4 py-3 rounded-xl border mr-3 ${selectedWalletId === w.id ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-zinc-950 border-zinc-800'}`}
                                        >
                                            <Text className={selectedWalletId === w.id ? 'text-indigo-400 font-bold' : 'text-zinc-400'}>{w.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </>
                        )}

                        <TouchableOpacity
                            className={`w-full py-4 rounded-xl items-center ${isSubmitting ? 'bg-indigo-600/50' : 'bg-indigo-600'}`}
                            onPress={handleContribute}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-bold text-base">Hacer aporte</Text>
                            )}
                        </TouchableOpacity>

                        <View className="h-6" />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
