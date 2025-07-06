import { View, Text, Button, Modal, StyleSheet } from 'react-native';

export interface CameraPermissionModalProps {
    onPermissionGranted: () => void;

}

export function CameraPermissionModal({ onPermissionGranted }: CameraPermissionModalProps) {

    return (
        <Modal
            transparent
            animationType="fade"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.message}>Precisamos da permissão usar a câmera do dispositivo</Text>
                    <Button onPress={onPermissionGranted} title="Permitir" />
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        width: '80%',
        elevation: 10,
    },
    message: {
        marginBottom: 16,
        fontSize: 16,
        textAlign: 'center',
    },
});