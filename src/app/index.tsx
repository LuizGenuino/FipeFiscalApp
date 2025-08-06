import React, { useEffect, useState, useCallback } from 'react';
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
    Image,
    ScrollView,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthService } from '../services/controller';
import { useLoading } from "@/contexts/LoadingContext";
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';

interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
        inspectorName: string;
    };
}

export default function LoginScreen() {
    const router = useRouter();
    const [inspectorName, setInspectorName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setLoading } = useLoading();

    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

    // Verifica autenticação e permissões ao montar o componente
    useEffect(() => {
        const initialize = async () => {
            try {
                await verifyAuth();
                await requestAllPermissions();
            } catch (error) {
                console.error('Initialization error:', error);
                setLoading(false);
            }
        };

        initialize();

        return () => {
            // Cleanup se necessário
        };
    }, []);

    const requestAllPermissions = useCallback(async () => {
        try {
            // Verifica se todas as permissões já foram concedidas
            if (mediaPermission?.status === 'granted' &&
                hasPermission &&
                locationPermission === true &&
                hasMicPermission) {
                return;
            }


            const mediaStatus = await requestMediaPermission();
            const cameraStatus = await requestPermission();
            const microphoneStatus = await requestMicPermission();
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

            setLocationPermission(locationStatus === 'granted');

            // Verifica se alguma permissão foi negada
            if (
                mediaStatus?.status !== 'granted' ||
                !cameraStatus ||
                locationStatus !== 'granted' ||
                !microphoneStatus
            ) {
                Alert.alert(
                    'Permissões Necessárias',
                    'Para uma experiência completa, por favor conceda todas as permissões nas configurações do seu dispositivo.',
                    [
                        { text: 'OK', onPress: () => { } },
                        { text: 'Configurações', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        } catch (error) {
            console.error('Permission request error:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao solicitar permissões.');
        }
    }, [mediaPermission, hasPermission, locationPermission, hasMicPermission]);

    const verifyAuth = useCallback(async () => {
        try {
            setLoading(true);
            const response: AuthResponse = await new AuthService().getUser();

            if (response.success && response.data?.inspectorName) {
                router.replace('/SearchTeam');
            }
        } catch (error) {
            console.error('Auth verification error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogin = async () => {
        // Validação do nome
        const trimmedName = inspectorName.trim();
        if (trimmedName.length < 4) {
            Alert.alert('Nome inválido', 'Por favor, digite seu nome completo (mínimo 4 caracteres)');
            return;
        }

        try {
            setIsLoading(true);
            setLoading(true);

            const response = await new AuthService().Login({ inspectorName: trimmedName });

            if (!response.success) {
                Alert.alert('Falha no login', response.message || 'Não foi possível realizar o login');
                await new AuthService().Logout();
                return;
            }

            router.replace('/SearchTeam');
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.');
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Image
                            source={require("../../assets/images/logofipe.0ab6fef0.png")}
                            style={styles.logo}
                            resizeMode="contain"
                            accessibilityLabel="Logo da aplicação"
                        />
                        <Text style={styles.title}>Fiscal de Pesca</Text>
                        <Text style={styles.subtitle}>Sistema de Registro de Pescas</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person"
                                size={20}
                                color="#666"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome completo"
                                placeholderTextColor="#94a3b8"
                                value={inspectorName}
                                onChangeText={setInspectorName}
                                autoCapitalize="words"
                                autoCorrect={false}
                                autoComplete="name"
                                textContentType="name"
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                                maxLength={50}
                                editable={!isLoading}
                                accessibilityLabel="Campo para inserir seu nome completo"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.7}
                            accessibilityLabel="Botão para realizar login"
                            accessibilityRole="button"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFE4C0',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 280,
        height: 160,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FB4803',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        maxWidth: 300,
    },
    form: {
        width: '100%',
        maxWidth: 350,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 24,
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
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    button: {
        backgroundColor: '#FB4803',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonDisabled: {
        backgroundColor: '#cbd5e1',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});