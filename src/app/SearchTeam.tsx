import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useLoading } from "@/src/contexts/LoadingContext";
import { useRouter } from 'expo-router';
import { useCameraContext } from '../contexts/CameraContext';


export default function SearchTeam() {
    const { openCamera, closeCamera } = useCameraContext();
    const router = useRouter();
    const [teamCode, setTeamCode] = useState('');
    const [layoutLoaded, setLayoutLoaded] = useState(false);
    const { setLoading } = useLoading();

    const handleSearch = async () => {
        const code = teamCode.trim().toUpperCase();

        if (!code) {
            Alert.alert('Erro', 'Por favor, digite o código do time');
            return;
        }

        if (code.length < 6) {
            Alert.alert('Codigo Invalido', 'Por favor, digite o código do time valido!');
            return;
        }

        if (!code.includes('-')) {
            Alert.alert('Codigo Invalido', 'Por favor, digite o código do time valido!');
            return;
        }

        router.push({ pathname: '/RegisterScore', params: { team_code: code } });
        setTeamCode("")
    };


    const handleCodeChange = (text: string) => {
        // Remove tudo que não é letra ou número
        let cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Limita a 5 caracteres (2 letras + 3 números)
        if (cleaned.length > 5) cleaned = cleaned.slice(0, 5);

        // Aplica a máscara AA-000
        let masked = cleaned;
        if (cleaned.length > 2) {
            masked = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
        }

        setTeamCode(masked);
    };

    const handleBarCodeScanned = async (type: string, data: string) => {
        closeCamera()
        const code = data.toUpperCase();
        if (!code) {
            Alert.alert('Erro', 'Por favor, digite o código do time');
            return;
        }

        if (code.length < 6) {
            Alert.alert('Codigo Invalido', 'Por favor, digite o código do time valido!');
            return;
        }

        if (!code.includes('-')) {
            Alert.alert('Codigo Invalido', 'Por favor, digite o código do time valido!');
            return;
        }
        setTeamCode(code);

        router.push({ pathname: '/RegisterScore', params: { team_code: code } });
        setTeamCode("")
    };

    return (
        <View style={styles.container} onLayout={() => {
            if (!layoutLoaded) {
                setLayoutLoaded(true);
                setLoading(false); // só chama depois que a tela estiver pronta
            }
        }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Ionicons name="search" size={60} color="#2563eb" />
                        <Text style={styles.title}>Buscar Time</Text>
                        <Text style={styles.subtitle}>Digite o código ou escaneie o QR Code</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-circle-outline" size={22} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Código do Time (ex: PU-001)"
                                value={teamCode}
                                onChangeText={handleCodeChange}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="search"
                                onSubmitEditing={() => {
                                    // Validação final (opcional)
                                    const isValid = /^[A-Z]{2}-\d{3}$/.test(teamCode);
                                    if (!isValid) {
                                        alert('Código inválido. Use o formato AA-000');
                                    } 
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSearch}
                            accessibilityLabel="Botão buscar time"
                        >

                            <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Buscar Time</Text>

                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>ou</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.qrButton} onPress={() =>
                            openCamera({
                                type: "qrcode", // ou "video", "qrcode"
                                onMediaCaptured: handleBarCodeScanned,
                            })
                        } accessibilityLabel="Ler QR Code">
                            <Ionicons name="qr-code-outline" size={22} color="#2563eb" style={styles.buttonIcon} />
                            <Text style={styles.qrButtonText}>Ler QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f9ff' },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 50, alignItems: "center" },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', marginTop: 12 },
    subtitle: { fontSize: 16, color: '#475569', marginTop: 8, textAlign: 'center' },
    form: { width: '100%', maxWidth: 350 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: 50, fontSize: 16, color: '#1f2937' },
    button: {
        backgroundColor: '#2563eb',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonDisabled: { backgroundColor: '#94a3b8' },
    buttonIcon: { marginRight: 8 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#d1d5db' },
    dividerText: { marginHorizontal: 12, color: '#6b7280', fontSize: 14 },
    qrButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2563eb',
        elevation: 2,
    },
    qrButtonText: { color: '#2563eb', fontSize: 16, fontWeight: 'bold' },
});
