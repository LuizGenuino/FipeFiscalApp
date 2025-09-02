import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScoreForm } from '@/components/ScoreForm';
import { RegisterCapture } from '@/components/RegisterCapture';

import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

import { Video } from 'react-native-compressor';
import { FishRecord } from '@/assets/types';
import { useLoading } from '@/contexts/LoadingContext';
import { AuthService, FishRecordService } from '@/services/controller';
import { getModality } from '@/services/storage';
import { generateUniqueCode } from '@/assets/randomCode';
import { PrintFormat } from '@/assets/printFormart';
import { ModalViewScore } from '@/components/ModalViewScore';
import { recordStyles } from "../../assets/styles/record.styles";



type QRCodeRef = {
    toDataURL: (callback: (dataURL: string) => void) => void;
};

export default function RegisterScore() {
    const { setLoading } = useLoading();
    const qrRef = useRef<QRCodeRef | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
    const router = useRouter();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const { team_code: teamCode } = useLocalSearchParams();
    const [fishRecord, setFishRecord] = useState<FishRecord>({
        code: "",
        team: '',
        category: "",
        modality: "",
        registered_by: "",
        species_id: "",
        size: 0,
        total_points: 0,
        card_number: '',
        card_image: '',
        fish_image: '',
        fish_video: '',
        latitude: 0,
        longitude: 0,
        synchronizedData: false,
        synchronizedMedia: false
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const isMounted = useRef(true);

    useFocusEffect(
        useCallback(() => {
            isMounted.current = true;
            if (!teamCode || typeof teamCode !== 'string' || teamCode.length < 5) {
                Alert.alert('Erro', 'Parâmetro do time não encontrado');
                router.back();
                return;
            }
            setFishRecord(prev => ({ ...prev, team: teamCode }));

            getInspectorName();

            return () => {
                isMounted.current = false;
                setFishRecord({
                    code: "",
                    team: '',
                    category: "",
                    modality: "",
                    registered_by: "",
                    species_id: "",
                    size: 0,
                    total_points: 0,
                    card_number: '',
                    card_image: '',
                    fish_image: '',
                    fish_video: '',
                    latitude: 0,
                    longitude: 0,
                    synchronizedData: false,
                    synchronizedMedia: false
                });
            };
        }, [])
    );


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('A permissão de localização foi negada');
            }
            if (mediaPermission?.status !== 'granted') {
                const response = await requestMediaPermission();
                setHasMediaLibraryPermission(response.granted);
            }
        })();
    }, []);

    const getInspectorName = async () => {
        const response = await new AuthService().getUser();
        if (!response.success && !response.data.inspectorName) {
            router.push('/');
            return;
        }

        let parsedData: any = {}
        const modalitySelected = await getModality()
        console.log(modalitySelected);

        if (modalitySelected) {
            parsedData = JSON.parse(modalitySelected);
        }
        console.log(parsedData);

        setFishRecord(prev => ({ ...prev, registered_by: response.data.inspectorName, modality: parsedData.modality, category: parsedData.category }));
    };

    const validateForm = () => {
        const fields = [
            { field: fishRecord.species_id, message: 'Selecione a espécie do peixe', role: fishRecord.category === "Embarcada" },
            { field: fishRecord.size, message: 'Digite o tamanho do peixe', role: true },
            { field: fishRecord.card_number, message: 'Digite o número da ficha', role: true },
            { field: fishRecord.registered_by, message: 'Digite o nome do responsável pelo registro', role: true },
            { field: fishRecord.fish_image, message: 'Capture a imagem do peixe na régua', role: true },
            { field: fishRecord.fish_video, message: 'Capture o vídeo da soltura do peixe', role: true },
            { field: fishRecord.card_image, message: 'Capture a imagem da ficha', role: true },
        ];

        for (let { field, message, role } of fields) {
            if (!field && role) {
                Alert.alert('Erro', message);
                return false;
            }
        }

        return true;
    };

    const getGeoLocation = async () => {
        // const newURI = await Video.compress(
        //     fishRecord.fish_video,
        //     {},
        //     (progress) => {
        //         console.log('Compression Progress: ', progress);
        //     }
        // );

        const newURI = fishRecord.fish_video

        let location = await Location.getCurrentPositionAsync({});
        console.log("localização atual:", location);
        setFishRecord(prev => ({
            ...prev,
            code: generateUniqueCode(),
            created_at: new Date().toISOString(),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            fish_video: newURI
        }));
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true)
        console.log("busca localização");

        await getGeoLocation()

        setShowConfirmModal(true);
        setLoading(false)
    };

    const handlePrint = async () => {
        console.log("função print: ", !!qrRef.current);

        if (!qrRef.current) return;

        try {
            qrRef.current?.toDataURL(async (dataURL) => {
                const html = PrintFormat({ fishRecord, dataURL });
                try {
                    await Print.printAsync({ html });
                    setShowConfirmModal(false);

                } catch (err) {
                    console.error("Erro ao imprimir:", err);
                }
            });
        } catch (error) {
            console.error("Error generating QR code data URL:", error);
            Alert.alert('Erro', 'Falha ao gerar o QR Code');
            return;

        }
    };

    const onConfirmAndPrint = async () => {
        setLoading(true);
        await handleConfirmSubmit();
    };

    const handleConfirmSubmit = async () => {
        setLoading(true);

        const fish_image_uri = await saveMediaLocally(`${fishRecord.team}_fish_image_${fishRecord.code}.jpg`, fishRecord.fish_image);
        const card_image_uri = await saveMediaLocally(`${fishRecord.team}_card_image_${fishRecord.code}.jpg`, fishRecord.card_image);
        const fish_video_uri = await saveMediaLocally(`${fishRecord.team}_fish_video_${fishRecord.code}.mp4`, fishRecord.fish_video);

        // ✅ Atualiza o estado apenas uma vez, com todos os caminhos corretos
        setFishRecord(prev => ({
            ...prev,
            fish_image: fish_image_uri,
            card_image: card_image_uri,
            fish_video: fish_video_uri
        }));

        const data = {
            ...fishRecord,
            fish_image: fish_image_uri,
            card_image: card_image_uri,
            fish_video: fish_video_uri
        }

        await new FishRecordService().setFishRecord(data);

        setLoading(false);
        setShowConfirmModal(false);

        await handlePrint();

        Alert.alert('Sucesso', 'Registro enviado com sucesso!', [
            { text: 'OK', onPress: () => router.back() },
        ]);

        await new FishRecordService().synchronizeFishRecord(data);
    };

    const saveMediaLocally = async (fileName: string, currentPath: string) => {
        try {
            const from = currentPath.startsWith("file://") ? currentPath : `file://${currentPath}`;
            const newPath = `${FileSystem.documentDirectory}${fileName}`;


            await FileSystem.copyAsync({ from, to: newPath });

            const asset = await MediaLibrary.createAssetAsync(newPath);
            await MediaLibrary.createAlbumAsync('Fiscal FIPE 2025', asset, false);

            return newPath; // ✅ retorna o novo caminho
        } catch (error) {
            console.log("SaveMediaLocally Error", error);
            alert('Falha ao salvar mídia na galeria.');
            return currentPath; // fallback
        }
    };


    return (
        <View style={recordStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={recordStyles.scrollContent}
            >
                <View style={recordStyles.content}>
                    <View style={recordStyles.card}>
                        <View style={recordStyles.cardHeader}>
                            <Ionicons name="person-add" size={24} color="#FB4803" />
                            <Text style={recordStyles.cardTitle}>Informações do Time</Text>
                        </View>
                        <View style={recordStyles.cardContent}>
                            <Text style={recordStyles.infoText}>
                                <Text style={recordStyles.infoLabel}>Código do Time: </Text>
                                {teamCode}
                            </Text>
                            <Text style={recordStyles.infoText}>
                                <Text style={recordStyles.infoLabel}>Modalidade: </Text>
                                {fishRecord.modality} - ({fishRecord.category})
                            </Text>
                        </View>
                    </View>

                    <ScoreForm fishRecord={fishRecord} setFishRecord={setFishRecord} />
                    <RegisterCapture fishRecord={fishRecord} setFishRecord={setFishRecord} />

                    <TouchableOpacity style={recordStyles.submitButton} onPress={handleSubmit}>
                        <Ionicons name="send" size={20} color="#fff" style={recordStyles.buttonIcon} />
                        <Text style={recordStyles.submitButtonText}>Enviar Registro</Text>
                    </TouchableOpacity>
                </View>

                <ModalViewScore
                    showModal={showConfirmModal}
                    setShowModal={setShowConfirmModal}
                    fishRecord={fishRecord}
                    handleConfirmSubmit={onConfirmAndPrint}
                    qrRef={qrRef}
                    textButtonClose="Corrigir"
                    textButtonConfirm="Registrar e Imprimir"
                    hideMedia={true}
                />
            </ScrollView>
        </View>
    );
}

