import { Ionicons } from "@expo/vector-icons";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { Video } from "expo-av";
import { FishRecord } from "../app";
import { useState } from "react";
import { Camera } from "./Camera";

interface ScoreFormProps {
    fishRecord: FishRecord;
    setFishRecord: React.Dispatch<React.SetStateAction<FishRecord>>;
}

export function RegisterCapture({ fishRecord, setFishRecord }: ScoreFormProps) {

    const [showCamera, setShowCamera] = useState(false);
    const [cameraType, setCameraType] = useState<'photo' | 'video'>('photo');
    const [photoType, setPhotoType] = useState<'fish' | 'ticket'>('fish');

    const handleTakePhoto = (type: 'fish' | 'ticket') => {
        setPhotoType(type);
        setCameraType('photo');
        setShowCamera(true);
    };

    const handleRecordVideo = () => {
        setCameraType('video');
        setShowCamera(true);
    };

    const handleMediaCaptured = (type: string, data: any) => {
        setShowCamera(false);
        if (!data || !data.uri) {
            Alert.alert('Erro', 'Não foi possível capturar a mídia. Tente novamente.');
            return;
        }

        if (type === 'photo') {
            if (photoType === 'fish') {
                setFishRecord((prev) => ({ ...prev, fishPhoto: data.uri }));
            } else {
                setFishRecord((prev) => ({ ...prev, ticketPhoto: data.uri }));
            }
        } else {
            setFishRecord((prev) => ({ ...prev, releaseVideo: data.uri }));
        }
    };

    const renderMediaSection = (label: string, mediaUri: string | undefined, onCapture: () => void, onRemove: () => void, isVideo = false) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name={isVideo ? "videocam" : "camera"} size={24} color="#2563eb" />
                <Text style={styles.cardTitle}>{label}</Text>
            </View>
            <View style={styles.cardContent}>
                {mediaUri ? (
                    <View style={{ gap: 12 }}>
                        {isVideo ? (
                            <Video
                                source={{ uri: mediaUri }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                shouldPlay={false}
                                style={{ width: '100%', height: 200, borderRadius: 8 }}
                                useNativeControls
                            />
                        ) : (
                            <Image
                                source={{ uri: mediaUri }}
                                style={{ width: '100%', height: 200, borderRadius: 8 }}
                            />
                        )}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={styles.mediaButton}
                                onPress={onCapture}
                            >
                                <Ionicons name={isVideo ? "videocam" : "camera"} size={20} color="#2563eb" />
                                <Text style={styles.mediaButtonText}>Capturar Novamente</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={onCapture}
                    >
                        <Ionicons name={isVideo ? "videocam" : "camera"} size={20} color="#2563eb" />
                        <Text style={styles.mediaButtonText}>Capturar {label}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {renderMediaSection(
                'Foto do Peixe',
                fishRecord.fishPhoto,
                () => handleTakePhoto('fish'),
                () => setFishRecord((prev: FishRecord) => ({ ...prev, fishPhoto: '' }))
            )}
            {renderMediaSection(
                'Vídeo de Soltura',
                fishRecord.releaseVideo,
                handleRecordVideo,
                () => setFishRecord((prev: FishRecord) => ({ ...prev, releaseVideo: '' })),
                true
            )}
            {renderMediaSection(
                'Foto da Ficha',
                fishRecord.ticketPhoto,
                () => handleTakePhoto('ticket'),
                () => setFishRecord((prev: FishRecord) => ({ ...prev, ticketPhoto: '' }))
            )}
            {showCamera && (
                <Camera
                    onClose={() => setShowCamera(false)}
                    type={cameraType}
                    onMediaCaptured={handleMediaCaptured}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
    mediaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#2563eb',
        borderRadius: 8,
        padding: 12,
        paddingHorizontal: 16,
    },
    mediaButtonText: {
        fontSize: 16,
        color: '#2563eb',
        marginLeft: 8,
        fontWeight: '600',
    },
});
