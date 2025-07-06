import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Modal,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'
import { Camera } from 'expo-camera';
import { FishRecord, RootStackParamList } from '..';
import { ScoreForm } from '@/src/components/ScoreForm';
import { RegisterCapture } from '@/src/components/RegisterCapture';

type RegisterScoreNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RegisterScore'>;
type RegisterScoreRouteProp = RouteProp<RootStackParamList, 'RegisterScore'>;

interface Props {
    navigation: RegisterScoreNavigationProp;
    route: RegisterScoreRouteProp;
}

export default function RegisterScoreScreen({ navigation, route }: Props) {
    const { team } = route.params;

    const [fishRecord, setFishRecord] = useState<FishRecord>({
        species: '',
        size: '',
        ticketNumber: '',
        teamMember: '',
        fishPhoto: '',
        ticketPhoto: '',
        releaseVideo: '',
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);


    const validateForm = () => {
        if (!fishRecord.species) {
            Alert.alert('Erro', 'Selecione a espécie do peixe');
            return false;
        }
        if (!fishRecord.size) {
            Alert.alert('Erro', 'Digite o tamanho do peixe');
            return false;
        }
        if (!fishRecord.ticketNumber) {
            Alert.alert('Erro', 'Digite o número da ficha');
            return false;
        }
        if (!fishRecord.teamMember) {
            Alert.alert('Erro', 'Selecione o membro da equipe');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        try {
            // Aqui você enviaria os dados para a API
            console.log('Enviando dados:', { team, fishRecord });

            // Simular envio
            await new Promise(resolve => setTimeout(resolve, 2000));

            setShowConfirmModal(false);
            Alert.alert('Sucesso', 'Registro enviado com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao enviar registro');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Team Info */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-add" size={24} color="#2563eb" />
                        <Text style={styles.cardTitle}>Informações do Time</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Nome: </Text>
                            {team.name}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Código: </Text>
                            {team.code}
                        </Text>
                    </View>
                </View>

                {/* Fish Data */}
                <ScoreForm fishRecord={fishRecord} setFishRecord={setFishRecord} />

                {/* Photos */}
                <RegisterCapture fishRecord={fishRecord} setFishRecord={setFishRecord} />


                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Ionicons name="send" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.submitButtonText}>Enviar Registro</Text>
                </TouchableOpacity>
            </View>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar Envio</Text>
                        <Text style={styles.modalSubtitle}>Verifique os dados antes de confirmar</Text>

                        <ScrollView style={styles.modalScroll}>
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Time</Text>
                                <Text style={styles.modalText}>Nome: {team.name}</Text>
                                <Text style={styles.modalText}>Código: {team.code}</Text>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Dados do Peixe</Text>
                                <Text style={styles.modalText}>Espécie: {fishRecord.species}</Text>
                                <Text style={styles.modalText}>Tamanho: {fishRecord.size} CM</Text>
                                <Text style={styles.modalText}>Nº Ficha: {fishRecord.ticketNumber}</Text>
                                <Text style={styles.modalText}>Pescador: {fishRecord.teamMember}</Text>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Mídia</Text>
                                <Text style={styles.modalText}>
                                    • Foto do peixe: {fishRecord.fishPhoto ? '✓' : '✗'}
                                </Text>
                                <Text style={styles.modalText}>
                                    • Foto da ficha: {fishRecord.ticketPhoto ? '✓' : '✗'}
                                </Text>
                                <Text style={styles.modalText}>
                                    • Vídeo da soltura: {fishRecord.releaseVideo ? '✓' : '✗'}
                                </Text>
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButtonSecondary}
                                onPress={() => setShowConfirmModal(false)}
                            >
                                <Text style={styles.modalButtonSecondaryText}>Corrigir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonPrimary}
                                onPress={handleConfirmSubmit}
                            >
                                <Text style={styles.modalButtonPrimaryText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 8,
    },
    cardContent: {
        padding: 16,
    },
    infoText: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    mediaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#2563eb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    mediaButtonText: {
        fontSize: 16,
        color: '#2563eb',
        marginLeft: 8,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonIcon: {
        marginRight: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalScroll: {
        maxHeight: 300,
    },
    modalSection: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 4,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButtonSecondary: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
    },
    modalButtonSecondaryText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalButtonPrimary: {
        flex: 1,
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 12,
        marginLeft: 8,
    },
    modalButtonPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});



