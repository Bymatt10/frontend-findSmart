import { create } from 'zustand';
import { apiClient } from '@/services/api';
import { Transaction } from '@/components/TransactionCard';

interface DashboardState {
    transactions: any[];
    isLoading: boolean;
    totalBalance: number;
    totalExpenses: number;
    totalIncome: number;
    fetchDashboardData: (month?: number, year?: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    transactions: [],
    isLoading: false,
    totalBalance: 0,
    totalExpenses: 0,
    totalIncome: 0,

    fetchDashboardData: async (month?: number, year?: number) => {
        set({ isLoading: true });
        try {
            const params: Record<string, number> = {};
            if (month) params['month'] = month;
            if (year) params['year'] = year;

            const [transactionsRes, summaryRes] = await Promise.all([
                apiClient.get('/transactions', { params: { limit: 5 } }),
                apiClient.get('/transactions/summary', { params })
            ]);

            const transactions = transactionsRes.data?.data || [];
            const summary = summaryRes.data?.data || { totalIncome: 0, totalExpense: 0, balance: 0, byCategory: {} };

            // Format transactions for the UI
            const formattedTransactions = transactions.map((t: any) => ({
                id: t.id,
                name: t.merchant_name || t.description || 'Gasto',
                category: t.categories?.name || 'Sin Categoría',
                amount: Number(t.amount),
                date: new Date(t.date).toLocaleDateString(),
                icon: t.categories?.icon || 'MapPin',
                original_currency: t.original_currency,
            }));

            set({
                transactions: formattedTransactions,
                totalExpenses: summary.totalExpense,
                totalIncome: summary.totalIncome,
                totalBalance: summary.balance,
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            set({ isLoading: false });
        }
    }
}));
