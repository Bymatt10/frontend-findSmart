import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore, ChatMessage } from '@/stores/chat.store';

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const messages = useChatStore(state => state.messages);
    const isLoading = useChatStore(state => state.isLoading);
    const sendMessage = useChatStore(state => state.sendMessage);
    const clearChat = useChatStore(state => state.clearChat);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList<ChatMessage>>(null);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const handleSend = () => {
        const text = inputText.trim();
        if (!text) return;
        setInputText('');
        sendMessage(text);
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.isUser;
        return (
            <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
                {!isUser && (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>IA</Text>
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
                    <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#f4f4f5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Coach Financiero</Text>
                </View>
                <TouchableOpacity onPress={clearChat}>
                    <Ionicons name="trash-outline" size={22} color="#a1a1aa" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {/* Message list */}
                <FlatList
                    ref={flatListRef}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderMessage}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyIcon}>🤖</Text>
                            <Text style={styles.emptyTitle}>Hola, soy tu Coach.</Text>
                            <Text style={styles.emptySubtitle}>
                                Puedes preguntarme sobre tu presupuesto, ideas para reducir gastos o consejos financieros basados en tu actividad.
                            </Text>
                        </View>
                    }
                />

                {/* Typing indicator */}
                {isLoading && (
                    <View style={styles.typingRow}>
                        <ActivityIndicator color="#818cf8" size="small" />
                        <Text style={styles.typingText}>El coach está escribiendo...</Text>
                    </View>
                )}

                {/* Input */}
                <View style={[styles.inputRow, { paddingBottom: insets.bottom + 12 }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Pregúntame algo de finanzas..."
                        placeholderTextColor="#71717a"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, { backgroundColor: inputText.trim() ? '#4f46e5' : '#27272a' }]}
                        disabled={!inputText.trim() || isLoading}
                        onPress={handleSend}
                    >
                        <Ionicons name="send" size={20} color={inputText.trim() ? 'white' : '#71717a'} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#09090b' },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#18181b',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 12, padding: 4 },
    headerTitle: { color: '#f4f4f5', fontSize: 20, fontWeight: '700' },
    list: { flex: 1 },
    listContent: { padding: 16, flexGrow: 1 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyIcon: { fontSize: 60, marginBottom: 16 },
    emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
    emptySubtitle: { color: '#71717a', textAlign: 'center', lineHeight: 22 },
    msgRow: { flexDirection: 'row', marginBottom: 12 },
    msgRowUser: { justifyContent: 'flex-end' },
    msgRowBot: { justifyContent: 'flex-start' },
    avatar: {
        width: 32, height: 32,
        borderRadius: 16,
        backgroundColor: '#4f46e5',
        alignItems: 'center', justifyContent: 'center',
        marginRight: 8, marginTop: 2,
    },
    avatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    bubble: {
        maxWidth: '75%',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    bubbleUser: { backgroundColor: '#4f46e5', borderBottomRightRadius: 4 },
    bubbleBot: { backgroundColor: '#27272a', borderBottomLeftRadius: 4 },
    bubbleText: { color: '#f4f4f5', fontSize: 15, lineHeight: 22 },
    typingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    typingText: { color: '#52525b', fontSize: 12, marginLeft: 8 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#18181b',
    },
    input: {
        flex: 1,
        backgroundColor: '#18181b',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 12,
        color: '#f4f4f5',
        fontSize: 15,
        minHeight: 48,
        maxHeight: 120,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#27272a',
    },
    sendBtn: {
        width: 48, height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
