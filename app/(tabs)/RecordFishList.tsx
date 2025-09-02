import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLoading } from "@/contexts/LoadingContext";
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConnection } from '@/contexts/connectionContext';
import { FishRecordService } from '@/services/controller';
import { FishRecord } from '@/assets/types';
import { storeLastSync } from '@/services/storage';
import { ModalViewScore } from '@/components/ModalViewScore';
import { COLORS } from '@/constants/Colors';
import { recordListStyles } from "../../assets/styles/recordList.styles";
import { PrintFormat } from '@/assets/printFormart';
import * as Print from 'expo-print';


type QRCodeRef = {
    toDataURL: (callback: (dataURL: string) => void) => void;
}

export default function RecordFishList() {
    const qrRef = useRef<QRCodeRef | null>(null);
    const router = useRouter();
    const fishRecordService = new FishRecordService()
    const [fishRecordList, setFishRecordList] = useState<FishRecord[]>()
    const [fishRecord, setFishRecord] = useState<FishRecord | null>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const { setLoading } = useLoading();
    const { setLastSync } = useConnection();
    const isMounted = useRef(true);

    useFocusEffect(
        useCallback(() => {
            isMounted.current = true;
            loadFishRecords();

            return () => {
                isMounted.current = false;
                setFishRecordList([])
                setFishRecord(null)
            };
        }, [])
    );

    const loadFishRecords = async () => {
        if (!isMounted.current) return;

        setLoading(true);
        try {
            const result = await fishRecordService.getAllFishRecord();
            console.log("result: ", result);

            if (!isMounted.current) return;

            if (!result.success) {
                Alert.alert("Erro", result.message, [
                    { text: 'OK', onPress: () => router.back() },
                ]);
                return;
            }

            if (isMounted.current) {
                setFishRecordList(result.data);
            }
        } catch (error) {
            console.error('Erro ao carregar registros:', error);
            if (isMounted.current) {
                Alert.alert("Erro", "Falha ao carregar registros");
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };


    const synchronizeFishRecord = async (item: FishRecord) => {
        try {
            if (item.synchronizedData) {
                Alert.alert(
                    "Item já sincronizado",
                    "Este registro já foi sincronizado com o servidor.",
                    [{ text: "OK", onPress: () => setShowModal(false) }]
                );
                return;
            }

            setLoading(true);

            const result = await fishRecordService.synchronizeFishRecord(item);

            if (!result.success) {
                throw new Error(result.message || "Erro na sincronização");
            }



        } catch (error: any) {
            console.error("Erro na sincronização:", error);

            Alert.alert(
                "Erro",
                error.message || "Falha ao sincronizar. Verifique sua conexão.",
                [{ text: "OK" }]
            );

        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const synchronizeAllFishRecord = async () => {
        try {
            // Filtra apenas registros não sincronizados
            const pendingSync = fishRecordList?.filter(item => !item.synchronizedData) || [];

            if (pendingSync.length === 0) {
                await storeLastSync()
                setLastSync(new Date().toLocaleString())
                Alert.alert("Sem Pendencias", "Todas as Pontuação foram sicronizadas!")
                return;
            }

            setLoading(true);


            // Sincronização sequencial com feedback
            for (const [index, record] of pendingSync.entries()) {
                try {
                    await synchronizeFishRecord(record);

                } catch (error) {
                    console.warn(`Falha no registro ${record.code}:`, error);
                    // Continua para o próximo mesmo com erro
                }
            }

        } catch (error) {
            console.error("Erro geral:", error);
        } finally {
            setLoading(false);
            await storeLastSync()
            setLastSync(new Date().toLocaleString())
        }
    };

    const handleModal = (item: FishRecord) => {
        setLoading(false)
        setFishRecord(item)
        setShowModal(true)
        setLoading(false)
    }

    const print = async (item: FishRecord) => {
        console.log("função print: ", !!qrRef.current);

        if (!qrRef.current) return;

        try {
            qrRef.current?.toDataURL(async (dataURL) => {
                const html = PrintFormat({ fishRecord: item, dataURL });
                try {
                    await Print.printAsync({ html });
                } catch (err) {
                    console.error("Erro ao imprimir:", err);
                }
            });
        } catch (error) {
            console.error("Error generating QR code data URL:", error);
            Alert.alert('Erro', 'Falha ao gerar o QR Code');
            return;

        }

    }

    return (
        <View style={recordListStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={recordListStyles.scrollContent}
            >
                {fishRecord && <ModalViewScore fishRecord={fishRecord} setShowModal={setShowModal} showModal={showModal}
                    handleConfirmSubmit={synchronizeFishRecord} qrRef={qrRef}
                    textButtonPrimary='Imprimir Comprovante' handleButtonPrimary={print} />}
                <View style={recordListStyles.header}>
                    <Ionicons name="browsers" size={60} color="#FB4803" />
                    <Text style={recordListStyles.title}>Lista de Pontuação</Text>
                    <Text style={recordListStyles.subtitle}>Historico dos Registros de Pontuações</Text>
                </View>
                {fishRecordList?.length ? (
                    <SafeAreaView style={recordListStyles.container}>
                        <ScrollView
                            contentContainerStyle={recordListStyles.scrollContent}

                        >
                            <View style={recordListStyles.cardList}>
                                {fishRecordList.map((item: FishRecord) => {
                                    return (
                                        <TouchableOpacity style={recordListStyles.cardItem} key={item.code} onPress={() => handleModal(item)} >
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>ID:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}>{item.code}</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Modalidade:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}>{item.modality}</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Dados Sincronizados:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold", color: item.synchronizedData ? "green" : "red" }]}>{item.synchronizedData ? "Sim" : "Não"}</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Midias Sincronizadas:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold", color: item.synchronizedMedia ? "green" : "red" }]}>{item.synchronizedMedia ? "Sim" : "Não"}</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Código do Time:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}>{item.team}</Text>
                                            </View>

                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Nº Ficha:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}>{item.card_number}</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Espécie: </Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}>{item.species_id || 'Peixe de Barranco'}</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Tamanho:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}>{item.size} Cm</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Pontuação:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}>{item.total_points} Pts</Text>
                                            </View>
                                            <View style={recordListStyles.row} >
                                                <Text style={recordListStyles.cardText}>Data:</Text>
                                                <Text style={[recordListStyles.cardText, { fontWeight: "bold" }]}> {new Date(item.created_at || '').toLocaleString()} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                                <TouchableOpacity
                                    style={recordListStyles.modalButtonPrimary}
                                    onPress={synchronizeAllFishRecord}
                                >
                                    <Text style={recordListStyles.modalButtonPrimaryText}>Sincronizar Tudo</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                ) : <Text style={[recordListStyles.subtitle, { marginTop: 60 }]} >Nenhum Registro Salvo ainda...</Text>}

            </ScrollView>
        </View>
    );
}
