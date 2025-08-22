import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLoading } from "@/contexts/LoadingContext";
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { AuthService } from '@/services/controller';
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
    const router = useRouter()
    const [inspectorName, setInspectorName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setLoading } = useLoading();

    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

    // Verifica autenticação e permissões ao montar o componente
    useEffect(() => {
        requestAllPermissions()
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


    const handleSignIn = async () => {
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
            router.push("/")
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.');
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={authStyles.keyboardView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/logofipe.0ab6fef0.png")}
                            style={authStyles.image}
                            resizeMode="contain"
                            accessibilityLabel="Logo da aplicação"
                        />
                    </View>
                    <Text style={authStyles.title}>Fiscal de Pesca</Text>
                    <Text style={authStyles.subtitle}>Sistema de Registro de Pescas</Text>


                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <Ionicons
                                name="person"
                                size={20}
                                color="#666"
                                style={authStyles.inputIcon}
                            />
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Digite seu nome completo"
                                placeholderTextColor={COLORS.textLight}
                                value={inspectorName}
                                onChangeText={setInspectorName}
                                autoCapitalize="words"
                                autoCorrect={false}
                                autoComplete="name"
                                textContentType="name"
                                returnKeyType="done"
                                onSubmitEditing={handleSignIn}
                                maxLength={50}
                                editable={!isLoading}
                                accessibilityLabel="Campo para inserir seu nome completo"
                            />
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, isLoading && authStyles.buttonDisabled]}
                            onPress={handleSignIn}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>{isLoading ? "Carregando..." : "Entrar"}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
