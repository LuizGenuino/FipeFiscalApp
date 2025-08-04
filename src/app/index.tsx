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
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';



export default function Index() {
    const router = useRouter();
    const [inspectorName, setInspectorName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setLoading } = useLoading();

    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

    useEffect(() => {
        const init = async () => {
            await verifyAuth();
            await requestAllPermissions();
        }

        init()

    }, []);


    const requestAllPermissions = async () => {
        try {

            if (mediaPermission?.status === 'granted' && hasPermission && locationPermission === true && hasMicPermission) {
                return;
            }


            const mediaStatus = await requestMediaPermission();
            const cameraStatus = await requestPermission();
            const microphoneStatus = await requestMicPermission();
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

            setLocationPermission(locationStatus === 'granted');

            if (
                mediaStatus?.status !== 'granted' ||
                !cameraStatus ||
                locationStatus !== 'granted' ||
                !microphoneStatus
            ) {
                Alert.alert(
                    'Permissões Necessárias',
                    'Este aplicativo precisa de permissões para Câmera, Localização e Galeria para funcionar corretamente.'
                );
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao solicitar permissões.');
            console.error(error);
        }
    };

    const verifyAuth = async () => {
        setLoading(true);
        const response: any = await new AuthService().getUser();

        if (response.success && response.data.inspectorName) {
            router.push('/SearchTeam');
        } else {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (inspectorName.length < 4) {
            Alert.alert('Erro', 'Digite o Nome Completo');
            return;
        }

        console.log(`Permissão de mídia: ${mediaPermission?.status}, Câmera: ${hasPermission}, Localização: ${locationPermission}, Microfone: ${hasMicPermission}`);


        if (
            mediaPermission?.status !== 'granted' || !hasPermission || !locationPermission || !hasMicPermission
        ) {
            Alert.alert('Permissões não concedidas', 'Verifique as permissões do app antes de continuar.');
            return;
        }

        setIsLoading(true);
        setLoading(true);

        const response = await new AuthService().Login({ inspectorName });

        if (!response.success) {
            Alert.alert('Tente Novamente', response.message);
            new AuthService().Logout();
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
                    <Ionicons name="fish" size={80} color="#FB4803" />
                    <Text style={styles.title}>Fiscal de Pesca</Text>
                    <Text style={styles.subtitle}>Sistema de Registro de Pescas</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nome Completo"
                            value={inspectorName}
                            onChangeText={setInspectorName}
                            autoCapitalize="words"
                            autoCorrect
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
        backgroundColor: '#FFE4C0',
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
        color: '#FB4803',
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
        maxWidth: 350,
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
        backgroundColor: '#FB4803',
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
