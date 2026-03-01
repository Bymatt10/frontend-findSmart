import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View, Text } from 'react-native';
import { IconPieChart, IconWallet, IconBulb, IconUser } from '@/components/LineIcons';

function TabIcon({
  focused,
  IconComponent
}: {
  focused: boolean,
  IconComponent: React.ComponentType<{ size?: number, color?: string }>
}) {
  return (
    <View className={`items-center justify-center pt-2 ${focused ? 'opacity-100' : 'opacity-50'}`}>
      <IconComponent size={24} color={focused ? '#818cf8' : '#71717a'} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#09090b', // zinc-950
          borderBottomWidth: 1,
          borderBottomColor: '#27272a', // zinc-800
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#09090b',
          borderTopWidth: 1,
          borderTopColor: '#27272a',
          height: 80,
          paddingBottom: 20,
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Resumen',
          tabBarIcon: ({ focused }) => <TabIcon IconComponent={IconPieChart} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ focused }) => <TabIcon IconComponent={IconWallet} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Sugerencias',
          tabBarIcon: ({ focused }) => <TabIcon IconComponent={IconBulb} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon IconComponent={IconUser} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
