import { useBusinessStore } from '@/stores/business.store';
import { PersonalDashboard } from '@/components/PersonalDashboard';
import { BusinessDashboard } from '@/components/BusinessDashboard';

export default function DashboardScreen() {
  const { isBusinessModeActive } = useBusinessStore();

  if (isBusinessModeActive) {
    return <BusinessDashboard />;
  }

  return <PersonalDashboard />;
}
