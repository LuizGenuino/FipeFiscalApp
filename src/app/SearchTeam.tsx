import React, { useEffect, useState, useCallback } from 'react';
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
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from 'expo-router';
import { useCameraContext } from '../contexts/CameraContext';
import { Select } from '../components/Select';
import { getModality, storeModality } from '../services/storage';

interface Modality {
    category: string;
    modality: string;
    code: string;
}

const MODALITY_TYPES: Modality[] = [
    { category: "Embarcada", modality: "Motorizada", code: "MO-" },
    { category: "Embarcada", modality: "Caiaque", code: "CE-" },
    { category: "Embarcada", modality: "Canoa", code: "CA-" },
    { category: "Barranco", modality: "Infantil", code: "I1-" },
    { category: "Barranco", modality: "Juvenil", code: "J1-" },
    { category: "Barranco", modality: "PCD", code: "PC-" },
    { category: "Barranco", modality: "Sênior", code: "SE-" },
];

const CODE_REGEX = /^[A-Z0-9]{2}-\d{3}$/;
const CODE_PREFIX_REGEX = /^[A-Z]{2}-/;

export default function SearchTeam() {
    const { openCamera, closeCamera } = useCameraContext();
    const router = useRouter();
    const { setLoading } = useLoading();

    const [teamCode, setTeamCode] = useState('');
    const [layoutLoaded, setLayoutLoaded] = useState(false);
    const [modality, setModality] = useState<Modality>({ category: "", modality: "", code: "" });

    const modalitySelected = modality.code !== "";
    const hasValidCode = CODE_REGEX.test(teamCode);

    // Load saved modality on mount
    useEffect(() => {
        setLoading(false)
        const loadSavedModality = async () => {
            try {
                const saved = await getModality();
                if (saved) {
                    const parsed = JSON.parse(saved) as Modality;
                    setModality(parsed);
                    setTeamCode(parsed.code);
                }
            } catch (error) {
                console.error('Failed to load saved modality:', error);
            }
        };

        loadSavedModality();
    }, []);

    // Update code prefix when modality changes
    useEffect(() => {
        if (modality.code && !teamCode.startsWith(modality.code)) {
            setTeamCode(modality.code);
        }
    }, [modality.code]);

    const handleModalityChange = useCallback((val: string) => {
        const selected = MODALITY_TYPES.find((tipo) => tipo.modality === val);
        if (selected) {
            setModality(selected);
            setTeamCode(selected.code);
        }
    }, []);

    const handleCodeChange = (text: string) => {
        // Prevent editing the prefix if it matches the selected modality
        if (modalitySelected && text.startsWith(modality.code)) {
            const suffix = text.slice(modality.code.length);
            const cleanedSuffix = suffix.replace(/\D/g, '');
            const formatted = `${modality.code}${cleanedSuffix.slice(0, 3)}`;
            setTeamCode(formatted);
            return;
        }

        // Free input when no modality is selected
        let cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (cleaned.length > 5) cleaned = cleaned.slice(0, 5);
        const masked = cleaned.length > 2 ? `${cleaned.slice(0, 2)}-${cleaned.slice(2)}` : cleaned;
        setTeamCode(masked);
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const code = teamCode.trim().toUpperCase();

            if (!modalitySelected) {
                Alert.alert('Atenção', 'Selecione a modalidade antes de digitar o código');
                return;
            }

            if (!CODE_REGEX.test(code)) {
                Alert.alert('Código inválido', 'Digite o código no formato correto (AA-000)');
                return;
            }

            // Verify the code matches the selected modality
            if (!code.startsWith(modality.code)) {
                Alert.alert('Código inválido', `O código deve começar com ${modality.code}`);
                return;
            }

            await storeModality(modality);
            router.push({ pathname: '/RegisterScore', params: { team_code: code } });
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao buscar o time');
        } finally {
            setLoading(false);
            setTeamCode(modality.code)
        }
    };

    const handleBarCodeScanned = async (_type: string, data: string) => {
        try {
            setLoading(true);
            closeCamera();

            const code = data.trim().toUpperCase();

            if (!CODE_REGEX.test(code)) {
                Alert.alert('Código inválido', 'QR Code inválido ou mal formatado.');
                return;
            }

            // Find modality by code prefix
            const value = MODALITY_TYPES.find((item) => code.startsWith(item.code));
            if (!value) {
                Alert.alert('Modalidade não encontrada', 'O código não corresponde a nenhuma modalidade conhecida.');
                return;
            }

            setModality(value);
            await storeModality(value);
            router.push({ pathname: '/RegisterScore', params: { team_code: code } });
        } catch (error) {
            console.error('Barcode scan error:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao processar o QR Code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            style={styles.container}
            onLayout={() => !layoutLoaded && setLayoutLoaded(true)}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Ionicons name="search" size={60} color="#FB4803" />
                        <Text style={styles.title}>Buscar Time</Text>
                        <Text style={styles.subtitle}>Digite o código ou escaneie o QR Code</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={[styles.pickerContainer, !modalitySelected && styles.errorBorder]}>
                            <Text style={styles.pickerLabel}>Modalidade:</Text>
                            <Select
                                onValueChange={handleModalityChange}
                                options={MODALITY_TYPES.map(tipo => ({
                                    label: tipo.modality,
                                    value: tipo.modality,
                                }))}
                                selectedValue={modality.modality}
                                placeholder="Selecione a Modalidade"
                            />
                        </View>

                        {!modalitySelected && (
                            <Text style={styles.errorText}>
                                Selecione a modalidade antes de digitar o código
                            </Text>
                        )}

                        <View style={styles.inputContainer}>
                            <Ionicons name="person-circle-outline" size={22} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={`Código do Time (ex: ${modality.code || 'MO-'}001)`}
                                value={teamCode}
                                onChangeText={handleCodeChange}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                keyboardType={modalitySelected ? 'number-pad' : 'default'}
                                returnKeyType="search"
                                editable={modalitySelected || !modalitySelected && teamCode.length === 0}
                                onSubmitEditing={handleSearch}
                                maxLength={6}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, (!modalitySelected || !hasValidCode) && styles.buttonDisabled]}
                            onPress={handleSearch}
                            accessibilityLabel="Botão buscar time"
                            disabled={!modalitySelected || !hasValidCode}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Buscar Time</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>ou</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.qrButton}
                            onPress={() => openCamera({
                                type: "qrcode",
                                onMediaCaptured: handleBarCodeScanned,
                            })}
                            accessibilityLabel="Ler QR Code"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="qr-code-outline" size={22} color="#FB4803" style={styles.buttonIcon} />
                            <Text style={styles.qrButtonText}>Ler QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE4C0'
    },
    keyboardView: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: "center"
    },
    header: {
        alignItems: 'center',
        marginBottom: 40
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FB4803',
        marginTop: 12
    },
    subtitle: {
        fontSize: 16,
        color: '#475569',
        marginTop: 8,
        textAlign: 'center'
    },
    form: {
        width: '100%',
        maxWidth: 350
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginVertical: 16,
        overflow: 'hidden',
    },
    pickerLabel: {
        fontSize: 10,
        marginTop: 5,
        marginLeft: 5,
        color: '#64748b'
    },
    errorBorder: {
        borderColor: "#ef4444",
    },
    errorText: {
        fontSize: 13,
        color: "red",
        fontWeight: '800',
        textAlign: "center",
        marginBottom: 5
    },
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
    inputIcon: {
        marginRight: 12
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#1f2937'
    },
    button: {
        backgroundColor: '#FB4803',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8'
    },
    buttonIcon: {
        marginRight: 8
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#d1d5db'
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#6b7280',
        fontSize: 14
    },
    qrButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FB4803',
        elevation: 2,
    },
    qrButtonText: {
        color: '#FB4803',
        fontSize: 16,
        fontWeight: 'bold'
    },
});