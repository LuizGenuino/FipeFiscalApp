import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'
import { FishRecord, RootStackParamList } from '..';
import { ScoreForm } from '@/src/components/ScoreForm';
import { RegisterCapture } from '@/src/components/RegisterCapture';
import { ModalConfirmScore } from '@/src/components/ModalConfirmScore';

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
            <ModalConfirmScore
                showConfirmModal={showConfirmModal}
                setShowConfirmModal={setShowConfirmModal}
                team={team}
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
        position: 'relative',
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



