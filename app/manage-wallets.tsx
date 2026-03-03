import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useWalletsStore } from '@/stores/wallets.store';
import * as icons from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

const BANKS_LIST = ['BAC', 'Lafise', 'Banpro', 'Ficohsa', 'Avanz', 'BDF', 'Efectivo', 'Otro'];

// Definición de colores base por banco (opcional para un diseño más bonito)
const BANK_COLORS: Record<string, string> = {
    'BAC': '#dc2626', // red-600
    'Lafise': '#16a34a', // green-600
    'Banpro': '#059669', // emerald-600
    'Ficohsa': '#2563eb', // blue-600
    'Avanz': '#ea580c', // orange-600
    'BDF': '#0284c7', // sky-600
    'Efectivo': '#818cf8', // indigo-400
    'Otro': '#71717a', // zinc-500
};

export default function ManageWalletsScreen() {
    const router = useRouter();
    const { wallets, fetchWallets, createWallet, updateWallet, deleteWallet, isLoading } = useWalletsStore();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [bankName, setBankName] = useState('BAC');
    const [name, setName] = useState('');
    const [type, setType] = useState<'debit' | 'savings' | 'credit_card' | 'cash'>('debit');
    const [currency, setCurrency] = useState<'NIO' | 'USD'>('NIO');
    const [balance, setBalance] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [creditLimit, setCreditLimit] = useState('');

    useEffect(() => {
        fetchWallets();
    }, []);

    const resetForm = () => {
        setBankName('BAC');
        setName('');
        setType('debit');
        setCurrency('NIO');
        setBalance('');
        setAccountNumber('');
        setCreditLimit('');
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Error', 'El nombre de la cuenta es requerido');

        const data = {
            bank_name: type === 'cash' ? 'Efectivo' : bankName,
            name,
            type,
            currency,
            balance: Number(balance) || 0,
            account_number: accountNumber || undefined,
            credit_limit: type === 'credit_card' ? (Number(creditLimit) || 0) : undefined,
            icon: type === 'cash' ? 'Banknote' : type === 'credit_card' ? 'CreditCard' : 'Landmark'
        };

        let result;
        if (editingId) {
            result = await updateWallet(editingId, data);
        } else {
            result = await createWallet(data as any);
        }

        if (result) {
            resetForm();
        } else {
            Alert.alert('Error', 'Ocurrió un error al guardar la billetera');
        }
    };

    const confirmDelete = (id: string, name: string) => {
        Alert.alert(
            'Eliminar Billetera',
            `¿Estás seguro que deseas eliminar "${name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => deleteWallet(id) }
            ]
        );
    };

    const startEdit = (wallet: any) => {
        setEditingId(wallet.id);
        setBankName(wallet.bank_name || 'Otro');
        setName(wallet.name);
        setType(wallet.type);
        setCurrency(wallet.currency);
        setBalance(wallet.balance.toString());
        setAccountNumber(wallet.account_number || '');
        setCreditLimit(wallet.credit_limit ? wallet.credit_limit.toString() : '');
        setIsAdding(true);
    };

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copiado', 'Número de cuenta copiado al portapapeles');
    };

    // Agrupar billeteras por banco
    const groupedWallets = wallets.reduce((acc, wallet) => {
        const bn = wallet.bank_name || 'Otro';
        if (!acc[bn]) acc[bn] = [];
        acc[bn].push(wallet);
        return acc;
    }, {} as Record<string, typeof wallets>);

    const bankSections = Object.keys(groupedWallets).sort((a, b) => a === 'Efectivo' ? 1 : b === 'Efectivo' ? -1 : a.localeCompare(b));

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-zinc-900 rounded-full items-center justify-center border border-zinc-800">
                    <icons.ArrowLeft size={20} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Mis Billeteras y Bancos</Text>
                <View className="w-10 h-10" />
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

                {isAdding ? (
                    <View className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800 mb-6">
                        <Text className="text-white font-bold text-lg mb-4">{editingId ? 'Editar Cuenta' : 'Nueva Cuenta'}</Text>

                        <Text className="text-zinc-400 text-xs font-semibold mb-2">Tipo de Cuenta</Text>
                        <View className="flex-row justify-between mb-4 space-x-1">
                            {['debit', 'savings', 'credit_card', 'cash'].map(t => (
                                <TouchableOpacity
                                    key={t}
                                    onPress={() => {
                                        setType(t as any);
                                        if (t === 'cash') setBankName('Efectivo');
                                    }}
                                    className={`flex-1 py-2 rounded-lg items-center border ${type === t ? 'bg-indigo-600 border-indigo-500' : 'bg-zinc-950 border-zinc-800'}`}
                                >
                                    <Text className={`text-[10px] font-bold ${type === t ? 'text-white' : 'text-zinc-400'} text-center`} numberOfLines={1}>
                                        {t === 'debit' ? 'Débito' : t === 'savings' ? 'Ahorro' : t === 'credit_card' ? 'Crédito' : 'Efectivo'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {type !== 'cash' && (
                            <>
                                <Text className="text-zinc-400 text-xs font-semibold mb-2">Banco a vincular</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                    {BANKS_LIST.filter(b => b !== 'Efectivo').map(bn => (
                                        <TouchableOpacity
                                            key={bn}
                                            onPress={() => setBankName(bn)}
                                            className={`px-4 py-2 rounded-xl mr-2 border ${bankName === bn ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-zinc-950 border-zinc-800'}`}
                                        >
                                            <Text className={bankName === bn ? 'text-indigo-400 font-bold' : 'text-zinc-400'}>{bn}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </>
                        )}

                        <Text className="text-zinc-400 text-xs font-semibold mb-2">Alias o Nombre (Ej. Nómina, Cuenta C$)</Text>
                        <View className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 mb-4">
                            <TextInput
                                className="text-white text-base"
                                placeholder="Ej. BAC C$"
                                placeholderTextColor="#52525b"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {type !== 'cash' && (
                            <>
                                <Text className="text-zinc-400 text-xs font-semibold mb-2">Número de Cuenta/Tarjeta (Opcional)</Text>
                                <View className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 mb-4">
                                    <TextInput
                                        className="text-white text-base"
                                        placeholder="Ej. *** 9182"
                                        placeholderTextColor="#52525b"
                                        keyboardType="numeric"
                                        value={accountNumber}
                                        onChangeText={setAccountNumber}
                                    />
                                </View>
                            </>
                        )}

                        <View className="flex-row mb-4 space-x-3">
                            <View className="flex-[0.8]">
                                <Text className="text-zinc-400 text-xs font-semibold mb-2">Moneda</Text>
                                <View className="flex-row border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden">
                                    <TouchableOpacity onPress={() => setCurrency('NIO')} className={`flex-1 py-3 items-center ${currency === 'NIO' ? 'bg-indigo-600/20' : ''}`}>
                                        <Text className={`font-bold ${currency === 'NIO' ? 'text-indigo-400' : 'text-zinc-500'}`}>C$</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setCurrency('USD')} className={`flex-1 py-3 items-center border-l border-zinc-800 ${currency === 'USD' ? 'bg-emerald-600/20' : ''}`}>
                                        <Text className={`font-bold ${currency === 'USD' ? 'text-emerald-400' : 'text-zinc-500'}`}>$</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-zinc-400 text-[10px] font-semibold mb-2">{type === 'credit_card' ? 'Saldo Consumido' : 'Balance Actual'}</Text>
                                <View className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 h-12">
                                    <TextInput
                                        className="text-white text-sm"
                                        placeholder="0.00"
                                        placeholderTextColor="#52525b"
                                        keyboardType="decimal-pad"
                                        value={balance}
                                        onChangeText={setBalance}
                                    />
                                </View>
                            </View>

                            {type === 'credit_card' && (
                                <View className="flex-1">
                                    <Text className="text-zinc-400 text-[10px] font-semibold mb-2">Límite</Text>
                                    <View className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 h-12">
                                        <TextInput
                                            className="text-white text-sm"
                                            placeholder="0.00"
                                            placeholderTextColor="#52525b"
                                            keyboardType="decimal-pad"
                                            value={creditLimit}
                                            onChangeText={setCreditLimit}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        <View className="flex-row space-x-3 mt-2">
                            <TouchableOpacity onPress={resetForm} className="flex-1 bg-zinc-800 py-3.5 rounded-xl items-center">
                                <Text className="text-white font-bold">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} className="flex-1 bg-indigo-600 py-3.5 rounded-xl items-center">
                                <Text className="text-white font-bold">Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        className="bg-indigo-600/15 border border-indigo-500/30 rounded-2xl py-4 flex-row justify-center items-center mb-6"
                        onPress={() => setIsAdding(true)}
                    >
                        <icons.Plus size={20} color="#818cf8" />
                        <Text className="text-indigo-400 font-bold ml-2">Añadir Nueva Cuenta</Text>
                    </TouchableOpacity>
                )}

                {/* Wallets Grouped List */}
                {wallets.length === 0 && !isLoading ? (
                    <View className="items-center py-10">
                        <icons.Wallet size={32} color="#52525b" />
                        <Text className="text-zinc-500 mt-4 text-center px-4">No tienes cuentas. Añade una cuenta bancaria, tarjeta o efectivo.</Text>
                    </View>
                ) : (
                    bankSections.map(bank => (
                        <View key={bank} className="mb-6">
                            <Text className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-3" style={{ color: BANK_COLORS[bank] || '#a1a1aa' }}>
                                {bank}
                            </Text>

                            <View className="bg-zinc-900/50 rounded-3xl border border-zinc-800/80 overflow-hidden">
                                {groupedWallets[bank].map((w, index) => (
                                    <View key={w.id} className={`p-4 flex-row items-center ${index !== groupedWallets[bank].length - 1 ? 'border-b border-zinc-800/80' : ''}`}>
                                        <View className="w-10 h-10 rounded-xl bg-zinc-800 items-center justify-center mr-4">
                                            {w.type === 'cash' ? <icons.Banknote size={20} color="#10b981" /> :
                                                w.type === 'credit_card' ? <icons.CreditCard size={20} color="#f43f5e" /> :
                                                    w.type === 'savings' ? <icons.PiggyBank size={20} color="#8b5cf6" /> :
                                                        <icons.Landmark size={20} color="#3b82f6" />}
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-[15px]">{w.name}</Text>

                                            <View className="flex-row items-center mt-1">
                                                <Text className="text-zinc-500 text-[10px] capitalize mr-2">
                                                    {w.type === 'debit' ? 'Débito' : w.type === 'savings' ? 'Ahorros' : w.type === 'credit_card' ? 'Crédito' : 'Efectivo'}
                                                </Text>

                                                {w.account_number && (
                                                    <TouchableOpacity onPress={() => copyToClipboard(w.account_number as string)} className="flex-row items-center bg-zinc-800/80 px-1.5 py-0.5 rounded-lg active:bg-zinc-700">
                                                        <Text className="text-zinc-400 text-[10px] mr-1">{w.account_number}</Text>
                                                        <icons.Copy size={10} color="#a1a1aa" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>

                                        <View className="items-end mr-3 justify-center">
                                            <Text className={`font-black text-base ${w.type === 'credit_card' && Number(w.balance) > 0 ? 'text-red-400' : 'text-white'}`}>
                                                {w.currency === 'USD' ? '$' : 'C$'}{Number(w.balance).toFixed(2)}
                                            </Text>
                                            {w.type === 'credit_card' && w.credit_limit ? (
                                                <Text className="text-zinc-500 text-[9px] mt-0.5">Lím: {w.currency === 'USD' ? '$' : 'C$'}{Number(w.credit_limit).toFixed(2)}</Text>
                                            ) : null}
                                        </View>

                                        <View className="flex-col items-center justify-between py-1">
                                            <TouchableOpacity onPress={() => startEdit(w)} className="p-1 mb-1">
                                                <icons.Pencil size={14} color="#71717a" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => confirmDelete(w.id, w.name)} className="p-1">
                                                <icons.Trash2 size={14} color="#f87171" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))
                )}

                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}
