import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FishRecord, TeamsOfflineStorage } from "../assets/types";
import QRCode from "react-native-qrcode-svg";


interface ModalConfirmScoreProps {
    showConfirmModal: boolean;
    setShowConfirmModal: (visible: boolean) => void;
    fishRecord: FishRecord;
    handleConfirmSubmit: () => void;
    qrRef: any
}

export function ModalConfirmScore({ showConfirmModal, setShowConfirmModal, fishRecord, handleConfirmSubmit, qrRef }: ModalConfirmScoreProps) {

    return (
        <Modal
            visible={showConfirmModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowConfirmModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>42º FIPE</Text>
                    <Text style={styles.modalSubtitle}>Registro de Confirmação de Pesca</Text>
                    <View style={styles.qrCodeCard} >
                        <QRCode
                            value={`https://google.com/${fishRecord.code}`}
                            size={200}
                            getRef={(c) => (qrRef.current = c)}
                        />
                        <Text>{fishRecord.code}</Text>
                    </View>
                    <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Pescado</Text>
                        <View style={styles.row} >
                            <Text style={styles.modalText}>Código:</Text>
                            <Text style={[styles.modalText, { fontWeight: "bold" }]}>{fishRecord.team}</Text>
                        </View>
                        <View style={styles.row} >
                            <Text style={styles.modalText}>Nº Ficha:</Text>
                            <Text style={[styles.modalText, { fontWeight: "bold" }]}>{fishRecord.ticket_number}</Text>
                        </View>
                        <View style={styles.row} >
                            <Text style={styles.modalText}>Espécie: </Text>
                            <Text style={[styles.modalText, { fontWeight: "bold" }]}>{fishRecord.species}</Text>
                        </View>
                        <View style={styles.row} >
                            <Text style={styles.modalText}>Tamanho:</Text>
                            <Text style={[styles.modalText, { fontWeight: "bold" }]}>{fishRecord.size} Cm</Text>
                        </View>
                        <View style={styles.row} >
                            <Text style={styles.modalText}>Pontuação:</Text>
                            <Text style={[styles.modalText, { fontWeight: "bold" }]}>{fishRecord.point} Pts</Text>
                        </View>
                    </View>

                    <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Mídia</Text>
                        <View style={styles.row}>
                            <Text style={styles.modalText}>
                                Foto da Ficha:
                            </Text>
                            <Text style={styles.modalText}>
                                {fishRecord.card_image ? '✓' : 'x'}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.modalText}>
                                Foto do Peixe:
                            </Text>
                            <Text style={styles.modalText}>
                                {fishRecord.card_image ? '✓' : 'x'}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.modalText}>
                                Vídeo da soltura:
                            </Text>
                            <Text style={styles.modalText}>
                                {fishRecord.card_image ? '✓' : 'x'}
                            </Text>
                        </View>
                    </View>

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
        width: 300,
        maxHeight: '90%',
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
        width: "100%",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 15,
        marginTop: 15,
        textAlign: "center"
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
    qrCodeCard: {

        alignItems: "center"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
});

