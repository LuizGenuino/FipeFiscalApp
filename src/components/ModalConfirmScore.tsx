import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FishRecord, TeamsOfflineStorage } from "../assets/types";

interface ModalConfirmScoreProps {
    showConfirmModal: boolean;
    setShowConfirmModal: (visible: boolean) => void;
    team: Partial<TeamsOfflineStorage>;
    fishRecord: FishRecord;
    handleConfirmSubmit: () => void;
}

export function ModalConfirmScore({showConfirmModal, setShowConfirmModal, team, fishRecord, handleConfirmSubmit}: ModalConfirmScoreProps) {
    return (
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
                            <Text style={styles.modalText}>Nome: {team.team_name}</Text>
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
    )
}
const styles = StyleSheet.create({
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

