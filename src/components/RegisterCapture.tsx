import { Ionicons } from "@expo/vector-icons";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Modal,
} from "react-native";
import { useState, useCallback } from "react";
import { Camera } from "./Camera";
import { FishRecord } from "../assets/types";
import VideoPreview from "./VideoPreview";

interface ScoreFormProps {
    fishRecord: FishRecord;
    setFishRecord: React.Dispatch<React.SetStateAction<FishRecord>>;
}

export function RegisterCapture({ fishRecord, setFishRecord }: ScoreFormProps) {
    const [showCamera, setShowCamera] = useState(false);
    const [cameraType, setCameraType] = useState<"photo" | "video">("photo");
    const [photoType, setPhotoType] = useState<"fish" | "ticket">("fish");

    const openCameraForPhoto = useCallback((type: "fish" | "ticket") => {
        setPhotoType(type);
        setCameraType("photo");
        setShowCamera(true);
    }, []);

    const openCameraForVideo = useCallback(() => {
        setCameraType("video");
        setShowCamera(true);
    }, []);

    const handleMediaCaptured = (type: string, data: any) => {
        setShowCamera(false);

        if (!data || !data.uri) {
            Alert.alert("Erro", "Não foi possível capturar a mídia. Tente novamente.");
            return;
        }

        if (type === "photo") {
            if (photoType === "fish") {
                setFishRecord((prev) => ({ ...prev, fishPhoto: data.uri ?? "" }));
            } else {
                setFishRecord((prev) => ({ ...prev, ticketPhoto: data.uri ?? "" }));
            }
        } else if (type === "video") {
            setFishRecord((prev) => ({ ...prev, releaseVideo: data.uri ?? "" }));
        }
    };

    const removeMedia = (mediaKey: keyof FishRecord) => {
        setFishRecord((prev) => ({ ...prev, [mediaKey]: "" }));
    };

    const renderMediaSection = (
        label: string,
        mediaUri: string | undefined,
        onCapture: () => void,
        onRemove: () => void,
        isVideo = false
    ) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name={isVideo ? "videocam" : "camera"} size={24} color="#2563eb" />
                <Text style={styles.cardTitle}>{label}</Text>
            </View>
            <View style={styles.cardContent}>
                {mediaUri ? (
                    <>
                        {isVideo ? (
                            <VideoPreview
                                source={mediaUri} />
                        ) : (
                            <Image
                                source={{ uri: mediaUri }}
                                style={styles.mediaPreview}
                            />
                        )}
                        <View style={styles.mediaButtonsContainer}>
                            <TouchableOpacity
                                style={styles.mediaButton}
                                onPress={onCapture}
                                accessible
                                accessibilityLabel={`Capturar ${label} novamente`}
                            >
                                <Ionicons name={isVideo ? "videocam" : "camera"} size={20} color="#2563eb" />
                                <Text style={styles.mediaButtonText}>Capturar Novamente</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={onCapture}
                        accessible
                        accessibilityLabel={`Capturar ${label}`}
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
                "Foto do Peixe",
                fishRecord.fish_image,
                () => openCameraForPhoto("fish"),
                () => removeMedia("fish_image")
            )}
            {renderMediaSection(
                "Vídeo de Soltura",
                fishRecord.fish_video,
                openCameraForVideo,
                () => removeMedia("fish_video"),
                true
            )}
            {renderMediaSection(
                "Foto da Ficha",
                fishRecord.card_image,
                () => openCameraForPhoto("ticket"),
                () => removeMedia("fish_video")
            )}

            {showCamera && (
                <Modal
                    animationType="slide"
                    visible={showCamera}
                >
                    <Camera
                        onClose={() => setShowCamera(false)}
                        active={showCamera}
                        type={cameraType}
                        onMediaCaptured={handleMediaCaptured}
                    />
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
        marginLeft: 8,
    },
    cardContent: {
        padding: 16,
    },
    mediaPreview: {
        width: "auto",
        height: 300,
        borderRadius: 8,
        marginBottom: 12,
        objectFit: "contain"
    },
    mediaButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
    },
    mediaButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    removeButton: {
        borderColor: "#ef4444",
        backgroundColor: "#fff0f0",
    },
    mediaButtonText: {
        fontSize: 16,
        color: "#2563eb",
        marginLeft: 8,
        fontWeight: "600",
    },
});
