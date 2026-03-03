import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { supabase } from '@/services/supabase';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { useBusinessStore } from '@/stores/business.store';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as icons from 'lucide-react-native';

function MenuItem({ icon: Icon, label, onPress, color = '#818cf8', danger = false }: {
    icon: any, label: string, onPress: () => void, color?: string, danger?: boolean
}) {
    return (
        <TouchableOpacity
            className={`flex-row items-center py-4 border-b ${danger ? 'border-red-900/20' : 'border-zinc-800/50'}`}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${danger ? 'bg-red-500/10' : 'bg-indigo-500/10'}`}>
                <Icon size={18} color={danger ? '#f87171' : color} />
            </View>
            <Text className={`flex-1 font-medium text-[15px] ${danger ? 'text-red-400' : 'text-white'}`}>{label}</Text>
            <icons.ChevronRight size={18} color="#3f3f46" />
        </TouchableOpacity>
    );
}

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isBusinessModeActive, setBusinessModeActive } = useBusinessStore();

    const name = user?.user_metadata?.name || 'Usuario';
    const email = user?.email || '';
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <ScrollView className="flex-1 bg-zinc-950 px-5 pt-2" showsVerticalScrollIndicator={false}>
                <Text className="text-white text-3xl font-extrabold tracking-tight mb-6 mt-2">Perfil</Text>

                {/* Avatar + Info */}
                <View className="items-center mb-8">
                    <View className="w-20 h-20 bg-indigo-600/20 border-2 border-indigo-500/40 rounded-3xl items-center justify-center mb-3">
                        <Text className="text-indigo-400 text-2xl font-black">{initials}</Text>
                    </View>
                    <Text className="text-white text-lg font-bold">{name}</Text>
                    {email ? <Text className="text-zinc-500 text-sm mt-0.5">{email}</Text> : null}
                </View>

                {/* Configuración de Entorno */}
                <Text className="text-zinc-400 font-bold text-xs uppercase mb-2 ml-2">Entorno</Text>
                <View className="bg-zinc-900/50 rounded-2xl px-4 py-4 border border-zinc-800/50 mb-6 flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-emerald-500/10">
                            <icons.Briefcase size={18} color="#34d399" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-medium text-[15px] text-white">Modo Emprendedor</Text>
                            <Text className="text-zinc-500 text-xs">Activa la sección para tu negocio</Text>
                        </View>
                    </View>
                    <Switch
                        value={isBusinessModeActive}
                        onValueChange={setBusinessModeActive}
                        trackColor={{ false: '#3f3f46', true: '#34d399' }}
                        thumbColor="#fff"
                    />
                </View>

                {/* Menu */}
                <Text className="text-zinc-400 font-bold text-xs uppercase mb-2 ml-2">General</Text>
                <View className="bg-zinc-900/50 rounded-2xl px-4 border border-zinc-800/50 mb-6">
                    <MenuItem
                        icon={icons.Wallet}
                        label="Mis Billeteras"
                        onPress={() => router.push('/manage-wallets' as any)}
                    />
                    <MenuItem
                        icon={icons.LayoutGrid}
                        label="Mis Categorías"
                        onPress={() => router.push('/add-category' as any)}
                    />
                    <MenuItem
                        icon={icons.Target}
                        label="Mis Metas"
                        onPress={() => router.push('/(tabs)/goals' as any)}
                    />
                    <MenuItem
                        icon={icons.MessageCircle}
                        label="Chat con IA"
                        onPress={() => router.push('/chat' as any)}
                    />
                </View>

                {/* Danger Zone */}
                <View className="bg-zinc-900/50 rounded-2xl px-4 border border-zinc-800/50 mb-24">
                    <MenuItem
                        icon={icons.LogOut}
                        label="Cerrar Sesión"
                        onPress={() => supabase.auth.signOut()}
                        danger
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
