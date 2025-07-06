import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { use, useEffect, useState } from "react";
import { Alert, Button, Keyboard, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { CameraPermissionModal } from "./CameraPermissionModal";

interface CameraComponentProps {
    type: 'photo' | 'video' | 'qrcode';
    onMediaCaptured: (type: string, data: any) => void;
    onClose: () => void;
}

export function Camera({ type, onMediaCaptured, onClose }: CameraComponentProps) {
    const [camera, setCamera] = useState<any | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        Keyboard.dismiss();
    }, []);


    function alert() {
        Alert.alert(
            permission ? 'Camera permission granted' : 'Camera permission denied', `${type}`)
    }


    const takePicture = async () => {
        if (camera) {
            const photo = await camera.takePictureAsync();
            onMediaCaptured(type, photo);
        }
    };

    const recordVideo = async () => {
        if (camera && !isRecording) {
            setIsRecording(true);
            const video = await camera.recordAsync();
            setIsRecording(false);
            onMediaCaptured(type, video);
        } else if (camera && isRecording) {
            camera.stopRecording();
        }
    };

    return (
        <View style={styles.cameraContainer}>
            {permission && permission.granted ?
                <CameraView
                    style={styles.camera}
                    ref={(ref: any) => setCamera(ref)}
                    facing={"back"}
                    mode={type === 'video' ? 'video' : 'picture'}
                    active={true}
                    barcodeScannerSettings={type === 'qrcode' ? { barcodeTypes: ['qr'] } : undefined}
                    onBarcodeScanned={type === 'qrcode' ? ({ type, data }) => {
                        onMediaCaptured(type, data); // Handle QR code scan
                    } : undefined}
                >
                    {type === 'qrcode' ? (
                        <View style={styles.scannerOverlay}>
                            <View style={styles.scannerFrame} />
                            <Text style={styles.scannerText} >Posicione o QR Code dentro do quadro</Text>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onClose}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>

                    ) : (
                        <View style={styles.cameraOverlay}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={30} color="#fff" />
                            </TouchableOpacity>

                            <View style={styles.cameraControls}>
                                <TouchableOpacity
                                    style={[styles.captureButton, isRecording && styles.recordingButton]}
                                    onPress={type === 'photo' ? takePicture : recordVideo}
                                >
                                    <Ionicons
                                        name={type === 'photo' ? 'camera' : (isRecording ? 'stop' : 'videocam')}
                                        size={30}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                </CameraView>
                :
                (
                    <CameraPermissionModal onPermissionGranted={requestPermission} />
                )
            }
        </View >
    );
}


const styles = StyleSheet.create({
    cameraContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 1000,
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    cameraControls: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    captureButton: {
        backgroundColor: '#2563eb',
        borderRadius: 35,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingButton: {
        backgroundColor: '#ef4444',
    },
    scannerOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scannerFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'transparent',
    },
    scannerText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
    },
    cancelButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 30,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});