import { Ionicons } from "@expo/vector-icons";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner, useMicrophonePermission } from "react-native-vision-camera";
import {
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";


interface CameraComponentProps {
    type: "photo" | "video" | "qrcode";
    onMediaCaptured: (type: string, data: any) => void;
    active: boolean;
    onClose: () => void;
}

export function CameraView({ type, onMediaCaptured, active, onClose }: CameraComponentProps) {
    const device = useCameraDevice("back");
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [permission, setPermission] = useState<null | boolean>(null)

    const cameraRef = useRef<Camera>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const intervalRef = useRef<any>(null);
    const scannedRef = useRef(false);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            onMediaCaptured(codes[0].type, codes[0].value);
        }
    })

    useEffect(() => {
        scannedRef.current = false;

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        (async () => {
            const status = await requestPermission();
            const statusMic = await requestMicPermission();

            if (status && statusMic) {
                setPermission(true);
            }

        })();
    }, [])



    const handleCapture = async () => {
        try {
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePhoto();
                
                console.log("Photo captured:", photo);
                
                onMediaCaptured("photo", photo);
            }
        } catch (error) {
            console.log("handleCapture error, ", error);
        }
    };

    const stopRecordingTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const recordVideo = async () => {
        try {
            if (!cameraRef.current || !device) return;

            if (!isRecording) {
                setIsRecording(true);
                setRecordingTime(0);

                intervalRef.current = setInterval(() => {
                    setRecordingTime((prev) => prev + 1);
                }, 1000);

                await cameraRef.current.startRecording({
                    onRecordingFinished: (video) => {
                        console.log("Video recorded:", video);
                        onMediaCaptured("video", video);
                    },
                    onRecordingError: (error) => {
                        console.error("Recording error:", error);
                        stopRecordingTimer();
                        setIsRecording(false);
                    },
                });

            } else {
                await cameraRef.current.stopRecording();
                stopRecordingTimer();
                setIsRecording(false);
            }
        } catch (error) {
            console.log("recordVideo error:", error);
            stopRecordingTimer();
            setIsRecording(false);
        }
    };


    // const handleQRCodeScanned = useCallback(({ type, data }: { type: string; data: string }) => {
    //     if (scannedRef.current) return;
    //     scannedRef.current = true;
    //     onMediaCaptured("qrcode", data);
    // }, [onMediaCaptured]);

    if (permission === null) {
        return <View style={styles.cameraContainer} />;
    }
    if (!device || device === null) {
        return <View style={styles.cameraContainer} />;
    }

    return (
        <View style={styles.cameraContainer}>
            {/* Câmera com zIndex menor */}
            <View style={styles.cameraWrapper}>
                <Camera
                    ref={cameraRef}
                    style={styles.camera}
                    device={device}
                    isActive={active}
                    photo={type === "photo" || type === "qrcode"}
                    video={type === "video"}
                    audio={type === "video"? true : false}
                    resizeMode="cover"
                    codeScanner={type === "qrcode" ? codeScanner : undefined}
                />
            </View>

            {/* Overlay com os botões, sobrepondo a câmera */}
            <View style={styles.overlay} pointerEvents="box-none">
                {type === "qrcode" ? (
                    <View style={styles.scannerOverlay}>
                        <View style={styles.scannerFrame} />
                        <Text style={styles.scannerText}>Posicione o QR Code dentro do quadro</Text>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.cameraOverlay}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={30} color="#fff" />
                        </TouchableOpacity>

                        {isRecording && (
                            <View style={styles.timerContainer}>
                                <Text style={styles.timerText}>
                                    {Math.floor(recordingTime / 60)}:
                                    {String(recordingTime % 60).padStart(2, "0")}
                                </Text>
                            </View>
                        )}

                        <View style={styles.cameraControls}>
                            <TouchableOpacity
                                style={[styles.captureButton, isRecording && styles.recordingButton]}
                                onPress={type === "photo" ? handleCapture : recordVideo}
                            >
                                <Ionicons
                                    name={
                                        type === "photo"
                                            ? "camera"
                                            : isRecording
                                                ? "stop"
                                                : "videocam"
                                    }
                                    size={30}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99,
        backgroundColor: "#000",
        flex: 1,
    },
    cameraWrapper: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    camera: {
        flex: 1,
        width: '100%'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    cameraOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    closeButton: {
        position: "absolute",
        top: "6%",
        right: "6%",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
        padding: 8,
        zIndex: 10,
    },
    timerContainer: {
        position: "absolute",
        top: 50,
        alignSelf: "center",
        backgroundColor: "rgba(243, 5, 5, 0.83)",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 15,
        zIndex: 10,
    },
    timerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cameraControls: {
        alignItems: "center",
        paddingBottom: "20%",
    },
    captureButton: {
        backgroundColor: "#2563eb",
        borderRadius: 35,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    recordingButton: {
        backgroundColor: "#ef4444",
    },
    scannerOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    scannerFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "transparent",
    },
    scannerText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
    },
    cancelButton: {
        backgroundColor: "#ef4444",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 50,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
