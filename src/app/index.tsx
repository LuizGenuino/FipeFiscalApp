// app/index.tsx (ou app/Login.tsx, se você preferir renomear)
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthService } from '../services/controller';
import { useLoading } from "@/src/contexts/LoadingContext";

export default function Index() {
    const router = useRouter();
    const [inspectorName, setInspectorName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const authService = new AuthService()
    const { setLoading } = useLoading();

    useEffect(() => {
        verifyAuth()
    }, [])


    const verifyAuth = async () => {
        setLoading(true);
        const resonse: any = await authService.getUser();
        if (resonse.success && resonse.data.inspectorName) {
            await router.push({ pathname: '/SearchTeam' });
        } else {
            setLoading(false);
        }

    }


    const handleLogin = async () => {
        if (inspectorName.length < 4) {
            Alert.alert('Erro', 'Digite o Nome Completo');
            return;
        }
        setIsLoading(true);
        setLoading(true);
        const reponse = await authService.Login({ inspectorName })

        if (!reponse.success) {
            Alert.alert('Tente Novamente', reponse.message);
            authService.Logout()
            setIsLoading(false);
            setLoading(false);
            return;
        }
        setIsLoading(false);
        router.push('/SearchTeam');

    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="fish" size={80} color="#2563eb" />
                    <Text style={styles.title}>Fiscal de Pesca</Text>
                    <Text style={styles.subtitle}>Sistema de Registro de Pescas</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nome Cmpleto"
                            value={inspectorName}
                            onChangeText={setInspectorName}
                            autoCapitalize="sentences"
                            autoCorrect={true}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e40af',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 8,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        maxWidth: 350
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#1f2937',
    },
    button: {
        backgroundColor: '#2563eb',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
