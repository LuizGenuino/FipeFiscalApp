import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, CameraRecordingOptions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { CameraPermissionModal } from "./CameraPermissionModal";

interface CameraComponentProps {
    type: 'photo' | 'video' | 'qrcode';
    onMediaCaptured: (type: string, data: any) => void;
    onClose: () => void;
}

const recordingOptions: CameraRecordingOptions = {
    maxDuration: 30, // Máximo 60 segundos
};


export function Camera({ type, onMediaCaptured, onClose }: CameraComponentProps) {
    const [camera, setCamera] = useState<any | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [recordingTime, setRecordingTime] = useState(0);


    const intervalRef = useRef<any>(null);

    useEffect(() => {
        Keyboard.dismiss();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    const takePicture = async () => {
        if (camera) {
            const photo = await camera.takePictureAsync();
            onMediaCaptured(type, photo);
        }
    };

    const recordVideo = async () => {
        if (camera && !isRecording) {
            setIsRecording(true);

            setRecordingTime(0);

            // Inicia o cronômetro
            intervalRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

            const video = await camera.recordAsync(recordingOptions);
            onMediaCaptured(type, video);
            setIsRecording(false);


        } else if (camera && isRecording) {
            camera.stopRecording();
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
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
                            {/* Timer */}
                            {isRecording && (
                                <View style={styles.timerContainer}>
                                    <Text style={styles.timerText}>
                                        {Math.floor(recordingTime / 60)}:
                                        {String(recordingTime % 60).padStart(2, '0')}
                                    </Text>
                                </View>
                            )}

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
        zIndex: 9999,
        backgroundColor: '#000',
        flex: 1,
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    cameraOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
        zIndex: 10,
    },
    timerContainer: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        backgroundColor: 'rgba(243, 5, 5, 0.83)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 15,
        zIndex: 10,
    },
    timerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
