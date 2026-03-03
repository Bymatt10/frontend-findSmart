import { Tabs } from 'expo-router';
import { View } from 'react-native';
import * as icons from 'lucide-react-native';
import { useBusinessStore } from '@/stores/business.store';

function TabIcon({
  focused,
  Icon,
}: {
  focused: boolean;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}) {
  return (
    <View className="items-center justify-center pt-2">
      <Icon size={22} color={focused ? '#818cf8' : '#52525b'} />
      {focused && (
        <View className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5" />
      )}
    </View>
  );
}

export default function TabLayout() {
  const { isBusinessModeActive } = useBusinessStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(9,9,11,0.95)',
          borderTopWidth: 1,
          borderTopColor: '#1c1c1e',
          height: 75,
          paddingBottom: 16,
          paddingTop: 4,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#52525b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isBusinessModeActive ? 'Mi Negocio' : 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon Icon={isBusinessModeActive ? icons.Briefcase : icons.Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ focused }) => <TabIcon Icon={icons.ArrowLeftRight} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Metas',
          tabBarIcon: ({ focused }) => <TabIcon Icon={icons.Target} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Asistente',
          tabBarIcon: ({ focused }) => <TabIcon Icon={icons.Sparkles} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon Icon={icons.User} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
