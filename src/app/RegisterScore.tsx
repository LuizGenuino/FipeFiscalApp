import React, { useEffect, useRef, useState } from 'react';
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
import { FishRecord } from '../assets/types';
import { generateUniqueCode } from '../assets/randomCode';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { PrintFormat } from '../assets/printFormart';
import { FishRecordService } from '../services/controller';
import { useLoading } from '../contexts/LoadingContext';

type QRCodeRef = {
    toDataURL: (callback: (dataURL: string) => void) => void;
};

export default function RegisterScore() {
    const { setLoading } = useLoading();
    const qrRef = useRef<QRCodeRef | null>(null);

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
        synchronized: false
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

    }


    const handlePrint = async () => {

        if (!qrRef.current) return;


        qrRef.current.toDataURL(async (dataURL) => {
            const html = PrintFormat({ fishRecord, dataURL });

            try {
                await Print.printAsync({ html });
                setShowConfirmModal(false);
                Alert.alert('Sucesso', 'Registro enviado com sucesso!', [
                    { text: 'OK', onPress: () => router.back() },
                ]);
            } catch (err) {
                console.error("Erro ao imprimir:", err);
            }
        });
    };

    const onConfirmAndPrint = async () => {
        setLoading(true);
        await handleConfirmSubmit();
        // await handlePrint();
    };

    const handleConfirmSubmit = async () => {
        try {
            await saveMediaLocally(`fish_image_${fishRecord.code}.jpg`, fishRecord.fish_image)
            await saveMediaLocally(`card_image_${fishRecord.code}.jpg`, fishRecord.card_image)
            await saveMediaLocally(`fish_video_${fishRecord.code}.jpg`, fishRecord.fish_video)

            const fishRecordService = new FishRecordService()
            const result = await fishRecordService.setFishRecord(fishRecord)

            console.log("handleConfirmSubmit: ", result);

            setLoading(false);
            if (result.success) {
                setShowConfirmModal(false);
                Alert.alert('Sucesso', 'Registro enviado com sucesso!', [
                    { text: 'OK', onPress: () => router.back() },
                ]);
                return
            }
            Alert.alert('Erro ao Salvar', result.message);
            return

        } catch (error) {
            console.log("ConfirmSubmit error", error);

            Alert.alert('Erro', 'Falha ao enviar registro');
        }
    };

    const saveMediaLocally = async (fileName: string, currentPath: string) => {
        try {
            const newPath = `${FileSystem.documentDirectory}${fileName}`;

            // Salvar imagem local
            await FileSystem.copyAsync({
                from: currentPath,
                to: newPath,
            });

            setFishRecord({ ...fishRecord, fish_image: newPath })
        } catch (error) {
            console.log("SaveMediaLocally Error", error);

        }
    }

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
                handleConfirmSubmit={onConfirmAndPrint}
                qrRef={qrRef}
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
