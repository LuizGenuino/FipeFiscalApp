import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from '@/src/components/Camera';
import { RootStackParamList, Team } from '../assets/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TeamsService, FishService } from '../services/controller';
import { clearUser, getUser } from '../services/storage';
import { useLoading } from "@/src/contexts/LoadingContext";
import { useRouter } from 'expo-router';

type SearchTeamNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchTeam'>;

// Mock data - substitua pela sua API

export default function SearchTeam() {
     const router = useRouter();
    const [teamCode, setTeamCode] = useState('PU001');
    const [isSearching, setIsSearching] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const teamsService = new TeamsService()
    const { setLoading } = useLoading();

    useEffect(() => {
        initialize()
    }, []);

    const initialize = async () => {
        await checkAuth();
        await setLoading(false);
    }

    const checkAuth = async () => {
        try {
            const userAuth: any = await getUser();
            if (!userAuth || !JSON.parse(userAuth)?.inspectorName) {
                router.push('/');
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            Alert.alert('Erro', 'Não foi possível verificar a autenticação');
        }
    };

    const handleSearch = async () => {
        const code = teamCode.trim().toUpperCase();
        if (!code) {
            Alert.alert('Erro', 'Por favor, digite o código do time');
            return;
        }

        if (code.length < 5) {
            Alert.alert('Codigo Invalido', 'Por favor, digite o código do time valido!');
            return;
        }

        router.push({ pathname: '/RegisterScore', params: { team_code: code } });
    };

    const handleBarCodeScanned = async (type: string, data: string) => {
        setShowScanner(false);
        const code = data.toUpperCase();
        if (!code) {
            Alert.alert('Erro', 'Por favor, digite o código do time');
            return;
        }

        if (code.length < 5) {
            Alert.alert('Codigo Invalido', 'Por favor, digite o código do time valido!');
            return;
        }
        setTeamCode(code);

         router.push({ pathname: '/RegisterScore', params: { team_code: code } });
    };

    return (
        <View style={styles.container}>
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
                                placeholder="Código do Time (ex: PU001)"
                                value={teamCode}
                                onChangeText={(text) => setTeamCode(text.toUpperCase())}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="search"
                                onSubmitEditing={handleSearch}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, (!teamCode || isSearching) && styles.buttonDisabled]}
                            onPress={handleSearch}
                            disabled={!teamCode || isSearching}
                            accessibilityLabel="Botão buscar time"
                            accessibilityState={{ disabled: !teamCode || isSearching }}
                        >
                            {isSearching ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>Buscar Time</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>ou</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.qrButton} onPress={() => setShowScanner(true)} accessibilityLabel="Ler QR Code">
                            <Ionicons name="qr-code-outline" size={22} color="#2563eb" style={styles.buttonIcon} />
                            <Text style={styles.qrButtonText}>Ler QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {showScanner && (
                <Camera type="qrcode" onMediaCaptured={handleBarCodeScanned} onClose={() => setShowScanner(false)} active={showScanner} />
            )}
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
