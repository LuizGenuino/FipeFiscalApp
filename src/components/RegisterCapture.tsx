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
import { useState, useCallback, useRef } from "react";
import { FishRecord } from "../assets/types";
import VideoPreview from "./VideoPreview";
import { useCameraContext } from "../contexts/CameraContext";

interface ScoreFormProps {
  fishRecord: FishRecord;
  setFishRecord: React.Dispatch<React.SetStateAction<FishRecord>>;
}

export function RegisterCapture({ fishRecord, setFishRecord }: ScoreFormProps) {
  const { openCamera, closeCamera } = useCameraContext();
  const photoTypeRef = useRef<"fish" | "ticket" | null>(null);

  const openCameraForPhoto = useCallback((type: "fish" | "ticket") => {

    photoTypeRef.current = type;

    openCamera({
      type: "photo", // ou "video", "qrcode"
      onMediaCaptured: handleMediaCaptured,
    })
  }, []);

  const openCameraForVideo = useCallback(() => {
    openCamera({
      type: "video", // ou "video", "qrcode"
      onMediaCaptured: handleMediaCaptured,
    })
  }, []);

  const handleMediaCaptured = (type: string, data: any) => {
    closeCamera()

    if (!data || !data.path) {
      Alert.alert("Erro", "Não foi possível capturar a mídia. Tente novamente.");
      return;
    }
    const photoType = photoTypeRef.current;

    if (type === "photo") {
      if (photoType === "fish") {
        
        setFishRecord((prev) => ({ ...prev, fish_image: data.path ?? "" }));
      } else {
        setFishRecord((prev) => ({ ...prev, card_image: data.path ?? "" }));
      }
    } else if (type === "video") {
      setFishRecord((prev) => ({ ...prev, fish_video: data.path ?? "" }));
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
    <View style={[styles.card, { width: isVideo ? "100%" : "48%" }]}>
      <View style={[styles.cardHeader, { padding: 8 }]}>
        <Ionicons name={isVideo ? "videocam" : "camera"} size={24} color="#FB4803" />
        <Text style={[styles.cardTitle, { fontSize: 16 }]}>{label}</Text>
      </View>
      <View style={styles.cardContent}>

        {mediaUri ? (
          <View style={styles.mediaPreview} >
            {isVideo ? (

              <VideoPreview
                source={mediaUri} />
            ) : (
              <Image
                source={{ uri: `file://${mediaUri}` }}
                style={styles.image}

              />
            )}
            <View style={styles.mediaButtonsContainer}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={onCapture}
                accessible
                accessibilityLabel={`Capturar ${label} novamente`}
              >
                <Text style={styles.mediaButtonText}>Capturar Novamente</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.mediaPreview} >
            <Ionicons name={isVideo ? "film" : "image"} size={80} color="#FB4803" />
            <View style={styles.mediaButtonsContainer}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={onCapture}
                accessible
                accessibilityLabel={`Capturar ${label}`}
              >
                <Text style={styles.mediaButtonText}>Capturar {label}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="camera" size={24} color="#FB4803" />
        <Text style={styles.cardTitle}>Captura de Mídias</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
          {renderMediaSection(
            "Foto do Peixe",
            fishRecord.fish_image,
            () => openCameraForPhoto("fish"),
            () => removeMedia("fish_image")
          )}
          {renderMediaSection(
            "Foto da Ficha",
            fishRecord.card_image,
            () => openCameraForPhoto("ticket"),
            () => removeMedia("fish_video")
          )}
          {renderMediaSection(
            "Vídeo de Soltura",
            fishRecord.fish_video,
            openCameraForVideo,
            () => removeMedia("fish_video"),
            true
          )}
        </View>
      </View>
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
    padding: 8,
  },
  mediaPreview: {
    height: 275,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#FB4803",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 273,
    borderRadius: 7,
  },

  mediaButtonsContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    width: "90%",
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FB4803",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  removeButton: {
    borderColor: "#ef4444",
    backgroundColor: "#fff0f0",
  },
  mediaButtonText: {
    fontSize: 10,
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    textAlign: "center",
  },
});
