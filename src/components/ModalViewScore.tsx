import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
  } from "react-native";
  import { FishRecord } from "../assets/types";
  import QRCode from "react-native-qrcode-svg";
  import VideoPreview from "./VideoPreview";
  import { Ionicons } from "@expo/vector-icons";
  import { SafeAreaView } from "react-native-safe-area-context";
  import React from "react";
  
  interface ModalConfirmScoreProps {
    showModal: boolean;
    setShowModal: (visible: boolean) => void;
    fishRecord: FishRecord;
    handleConfirmSubmit: () => void;
    qrRef?: React.RefObject<QRCode>;
  }
  
  export function ModalViewScore({
    showModal,
    setShowModal,
    fishRecord,
    handleConfirmSubmit,
    qrRef,
  }: ModalConfirmScoreProps) {
    const renderMediaSection = (
      label: string,
      mediaUri: string | undefined,
      isVideo = false
    ) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name={isVideo ? "videocam" : "camera"} size={24} color="#2563eb" />
          <Text style={styles.cardTitle}>{label}</Text>
        </View>
        <View style={styles.cardContent}>
          {mediaUri ? (
            isVideo ? (
              <VideoPreview source={mediaUri} />
            ) : (
              <Image source={{ uri: mediaUri }} style={styles.mediaPreview} />
            )
          ) : (
            <Text style={styles.modalText}>Não disponível</Text>
          )}
        </View>
      </View>
    );
  
    return (
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>42º FIPE</Text>
                <Text style={styles.modalSubtitle}>Registro de Confirmação de Pesca</Text>
  
                <View style={styles.qrCodeCard}>
                  <QRCode
                    value={`https://google.com/${fishRecord.code}`}
                    size={200}
                    getRef={(c) => (qrRef && qrRef.current ? (qrRef.current = c) : null)}
                  />
                  <Text>{fishRecord.code}</Text>
                </View>
  
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Pescado</Text>
  
                  <View style={styles.row}>
                    <Text style={styles.modalText}>Código do Time:</Text>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      {fishRecord.team}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.modalText}>Nº Ficha:</Text>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      {fishRecord.ticket_number}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.modalText}>Espécie:</Text>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      {fishRecord.species}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.modalText}>Tamanho:</Text>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      {fishRecord.size} cm
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.modalText}>Pontuação:</Text>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      {fishRecord.point} pts
                    </Text>
                  </View>
                </View>
  
                <View style={styles.modalSection}>
                  {renderMediaSection("Foto do Peixe", fishRecord.fish_image)}
                  {renderMediaSection("Vídeo de Soltura", fishRecord.fish_video, true)}
                  {renderMediaSection("Foto da Ficha", fishRecord.card_image)}
                </View>
  
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonSecondary}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.modalButtonSecondaryText}>Fechar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonPrimary}
                    onPress={handleConfirmSubmit}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Sincronizar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, width: "80%", maxWidth: 400 },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 20,
      width: "100%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1f2937",
      textAlign: "center",
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: "#6b7280",
      textAlign: "center",
      marginBottom: 20,
    },
    modalSection: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    modalSectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#374151",
      marginBottom: 15,
      marginTop: 15,
      textAlign: "center",
    },
    modalText: {
      fontSize: 14,
      color: "#4b5563",
      marginBottom: 4,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    modalButtonSecondary: {
      flex: 1,
      backgroundColor: "#f3f4f6",
      borderRadius: 8,
      padding: 12,
      marginRight: 8,
    },
    modalButtonSecondaryText: {
      color: "#374151",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    modalButtonPrimary: {
      flex: 1,
      backgroundColor: "#2563eb",
      borderRadius: 8,
      padding: 12,
      marginLeft: 8,
    },
    modalButtonPrimaryText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    qrCodeCard: {
      alignItems: "center",
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
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
      width: "100%",
      height: 250,
      borderRadius: 8,
      resizeMode: "contain",
    },
  });
  