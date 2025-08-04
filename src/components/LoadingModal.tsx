// src/components/LoadingModal.tsx
import { Modal, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useLoading } from "../contexts/LoadingContext";


export default function LoadingModal() {
    const { loading } = useLoading();

    return (
        <Modal transparent visible={loading} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#FB4803" />
                    <Text style={styles.text}>Carregando...</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.90)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
});
