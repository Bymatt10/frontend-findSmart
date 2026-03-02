import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/services/supabase';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                }
            }
        });

        if (error) {
            Alert.alert('Error de registro', error.message);
        } else {
            Alert.alert('Éxito', 'Verifica tu correo electrónico para confirmar la cuenta.');
        }
        setLoading(false);
    }

    return (
        <View className="flex-1 justify-center px-8 bg-zinc-950">
            <View className="mb-12">
                <Text className="text-3xl font-extrabold text-white mb-2 tracking-tight">Crear Cuenta</Text>
                <Text className="text-zinc-400 text-base">Únete a la revolución financiera</Text>
            </View>

            <View className="space-y-4">
                <TextInput
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500 mb-4"
                    placeholder="Nombre completo"
                    placeholderTextColor="#71717a"
                    onChangeText={(text) => setName(text)}
                    value={name}
                />
                <TextInput
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500 mb-4"
                    placeholder="Correo electrónico"
                    placeholderTextColor="#71717a"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    autoCapitalize={'none'}
                    keyboardType="email-address"
                />
                <TextInput
                    className="w-full h-14 bg-zinc-900 rounded-xl px-4 text-white border border-zinc-800 focus:border-indigo-500"
                    placeholder="Contraseña"
                    placeholderTextColor="#71717a"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                />

                <TouchableOpacity
                    className="w-full h-14 bg-indigo-600 rounded-xl items-center justify-center mt-8 active:bg-indigo-700"
                    disabled={loading}
                    onPress={() => signUpWithEmail()}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Registrarse</Text>
                    )}
                </TouchableOpacity>

                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity className="items-center mt-6">
                        <Text className="text-zinc-400">¿Ya tienes cuenta? <Text className="text-indigo-400 font-semibold">Inicia Sesión</Text></Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
