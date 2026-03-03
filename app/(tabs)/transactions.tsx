import { useBusinessStore } from '@/stores/business.store';
import { PersonalTransactions } from '@/components/PersonalTransactions';
import { BusinessTransactions } from '@/components/BusinessTransactions';

export default function TransactionsScreen() {
    const { isBusinessModeActive } = useBusinessStore();

    if (isBusinessModeActive) {
        return <BusinessTransactions />;
    }

    return <PersonalTransactions />;
}
