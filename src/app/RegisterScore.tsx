import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScoreForm } from '@/src/components/ScoreForm';
import { RegisterCapture } from '@/src/components/RegisterCapture';
import { ModalConfirmScore } from '@/src/components/ModalConfirmScore';
import { FishRecord, Members, TeamsOfflineStorage } from '../assets/types';
import { generateUniqueCode } from '../assets/randomCode';
import * as Print from 'expo-print';
import { PrintFormat } from '../assets/printFormart';

export default function RegisterScore() {
    const router = useRouter();
    const { team_code: teamCode } = useLocalSearchParams();
    const [fishRecord, setFishRecord] = useState<FishRecord>({
        code: "",
        team: '',
        registered_by: "",
        species: "",
        size: 0,
        point: 0,
        ticket_number: '',
        card_image: '',
        fish_image: '',
        fish_video: '',
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (!teamCode) {
            Alert.alert('Erro', 'Parâmetro do time não encontrado');
            router.back();
        }

        if (teamCode.length < 5) {
            Alert.alert('Erro', 'Parâmetro do time não encontrado');
            router.back();
        }

        if (typeof teamCode === 'string') {
            setFishRecord({ ...fishRecord, team: teamCode })
        }

    }, [teamCode, router]);

    const validateForm = () => {
        if (!fishRecord.species) {
            Alert.alert('Erro', 'Selecione a espécie do peixe');
            return false;
        }
        if (!fishRecord.size) {
            Alert.alert('Erro', 'Digite o tamanho do peixe');
            return false;
        }
        if (!fishRecord.ticket_number) {
            Alert.alert('Erro', 'Digite o número da ficha');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        setFishRecord({ ...fishRecord, code: generateUniqueCode() })
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        try {
            const html = PrintFormat({fishRecord});

            await Print.printAsync({ html });

            setShowConfirmModal(false);
            Alert.alert('Sucesso', 'Registro enviado com sucesso!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao enviar registro');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-add" size={24} color="#2563eb" />
                        <Text style={styles.cardTitle}>Informações do Time</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Código do Time: </Text>
                            {teamCode}
                        </Text>
                    </View>
                </View>

                <ScoreForm fishRecord={fishRecord} setFishRecord={setFishRecord} />
                <RegisterCapture fishRecord={fishRecord} setFishRecord={setFishRecord} />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Ionicons name="send" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.submitButtonText}>Enviar Registro</Text>
                </TouchableOpacity>
            </View>

            <ModalConfirmScore
                showConfirmModal={showConfirmModal}
                setShowConfirmModal={setShowConfirmModal}
                fishRecord={fishRecord}
                handleConfirmSubmit={handleConfirmSubmit}
            />
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
});
