import { create } from 'zustand';
import { apiClient } from '@/services/api';

// Mocking goals for MVP
export interface Goal {
    id: string;
    title: string;
    current_amount: number;
    target_amount: number;
    target_currency?: 'NIO' | 'USD';
    deadline?: string;
    status: 'active' | 'completed';
}

interface GoalsState {
    goals: Goal[];
    isLoading: boolean;
    fetchGoals: () => Promise<void>;
    addProgress: (id: string, amount: number) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
    goals: [],
    isLoading: false,

    fetchGoals: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/goals');
            set({
                goals: response.data?.data || [],
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching goals:', error);
            set({ isLoading: false });
        }
    },

    addProgress: async (id: string, amount: number) => {
        try {
            const response = await apiClient.patch(`/goals/${id}/progress`, {
                amount_to_add: amount
            });
            const updatedGoal = response.data?.data;
            const goals = get().goals;
            set({
                goals: goals.map(g => g.id === id ? updatedGoal : g)
            });
        } catch (error) {
            console.error('Error updating goal progress:', error);
        }
    }
}));
