import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FishRecord } from "../app";
import { useState } from "react";

interface ScoreFormProps {
    fishRecord: FishRecord;
    setFishRecord: React.Dispatch<React.SetStateAction<FishRecord>>;
}

export function RegisterCapture({ fishRecord, setFishRecord }: ScoreFormProps) {

    const [showCamera, setShowCamera] = useState(false);
    const [cameraType, setCameraType] = useState<'photo' | 'video'>('photo');
    const [photoType, setPhotoType] = useState<'fish' | 'ticket'>('fish');

    const handleTakePhoto = async (type: 'fish' | 'ticket') => {

        setPhotoType(type);
        setCameraType('photo');
        setShowCamera(true);
    };





    const handleRecordVideo = async () => {
        setCameraType('video');
        setShowCamera(true);
    };

    const handleMediaCaptured = (uri: string) => {
        setShowCamera(false);

        if (cameraType === 'photo') {
            if (photoType === 'fish') {
                setFishRecord((prev: FishRecord) => ({ ...prev, fishPhoto: uri }));
            } else {
                setFishRecord((prev: FishRecord) => ({ ...prev, ticketPhoto: uri }));
            }
        } else {
            setFishRecord((prev: FishRecord) => ({ ...prev, releaseVideo: uri }));
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="camera" size={24} color="#2563eb" />
                <Text style={styles.cardTitle}>Fotos</Text>
            </View>
            <View style={styles.cardContent}>
                <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={() => handleTakePhoto('fish')}
                >
                    <Ionicons name="camera-sharp" size={20} color="#2563eb" />
                    <Text style={styles.mediaButtonText}>
                        {fishRecord.fishPhoto ? 'Foto do Peixe ✓' : 'Foto do Peixe Completo'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={() => handleTakePhoto('ticket')}
                >
                    <Ionicons name="camera-sharp" size={20} color="#2563eb" />
                    <Text style={styles.mediaButtonText}>
                        {fishRecord.ticketPhoto ? 'Foto da Ficha ✓' : 'Foto da Ficha'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cardHeader}>
                <Ionicons name="videocam" size={24} color="#2563eb" />
                <Text style={styles.cardTitle}>Vídeo</Text>
            </View>
            <View style={styles.cardContent}>
                <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={handleRecordVideo}
                >
                    <Ionicons name="videocam" size={20} color="#2563eb" />
                    <Text style={styles.mediaButtonText}>
                        {fishRecord.releaseVideo ? 'Vídeo da Soltura ✓' : 'Gravar Soltura do Peixe'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
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