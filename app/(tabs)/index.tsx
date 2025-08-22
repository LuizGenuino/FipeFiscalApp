import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from 'expo-router';
import { useCameraContext } from '@/contexts/CameraContext';
import { getModality, storeModality } from '@/services/storage';
import { Select } from '@/components/Select';
import { homeStyles } from "../../assets/styles/home.styles";


interface Modality {
    category: string;
    modality: string;
    code: string;
}

const MODALITY_TYPES: Modality[] = [
    { category: "Embarcada", modality: "Motorizada", code: "MO-" },
    { category: "Embarcada", modality: "Caiaque", code: "CE-" },
    { category: "Embarcada", modality: "Canoa", code: "CA-" },
    { category: "Barranco", modality: "Infantil 1", code: "I1-" },
    { category: "Barranco", modality: "Infantil 2", code: "I2-" },
    { category: "Barranco", modality: "Juvenil 1", code: "J1-" },
    { category: "Barranco", modality: "Juvenil 2", code: "J2-" },
    { category: "Barranco", modality: "PCD", code: "PC-" },
    { category: "Barranco", modality: "Sênior", code: "SE-" },
];

const CODE_REGEX = /^[A-Z0-9]{2}-\d{3}$/;

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

    const handleModalityChange = useCallback((val: string | number) => {
        const value = typeof val === "number" ? String(val) : val;
        const selected = MODALITY_TYPES.find((tipo) => tipo.modality === value);
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
        <View style={homeStyles.container} onLayout={() => !layoutLoaded && setLayoutLoaded(true)}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={homeStyles.scrollContent}
            >
                <View style={homeStyles.header}>
                    <Ionicons name="search" size={60} color="#FB4803" />
                    <Text style={homeStyles.title}>Buscar Time</Text>
                    <Text style={homeStyles.subtitle}>Digite o código ou escaneie o QR Code</Text>
                </View>

                <View style={homeStyles.content} >
                    <View style={homeStyles.form}>
                        <View style={[homeStyles.pickerContainer, !modalitySelected && homeStyles.errorBorder]}>
                            <Text style={homeStyles.pickerLabel}>Modalidade:</Text>
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
                            <Text style={homeStyles.errorText}>
                                Selecione a modalidade antes de digitar o código
                            </Text>
                        )}

                        <View style={homeStyles.inputContainer}>
                            <Ionicons name="person-circle-outline" size={22} color="#64748b" style={homeStyles.inputIcon} />
                            <TextInput
                                style={homeStyles.input}
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
                            style={[homeStyles.button, (!modalitySelected || !hasValidCode) && homeStyles.buttonDisabled]}
                            onPress={handleSearch}
                            accessibilityLabel="Botão buscar time"
                            disabled={!modalitySelected || !hasValidCode}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="search" size={20} color="#fff" style={homeStyles.buttonIcon} />
                            <Text style={homeStyles.buttonText}>Buscar Time</Text>
                        </TouchableOpacity>

                        <View style={homeStyles.divider}>
                            <View style={homeStyles.dividerLine} />
                            <Text style={homeStyles.dividerText}>ou</Text>
                            <View style={homeStyles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={homeStyles.qrButton}
                            onPress={() => openCamera({
                                type: "qrcode",
                                onMediaCaptured: handleBarCodeScanned,
                            })}
                            accessibilityLabel="Ler QR Code"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="qr-code-outline" size={22} color="#FB4803" style={homeStyles.buttonIcon} />
                            <Text style={homeStyles.qrButtonText}>Ler QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

