import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from 'expo-router';
import { FishRecordService } from '../services/controller';
import { FishRecord } from '../assets/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalViewScore } from '../components/ModalViewScore';
import { storeLastSync } from '../services/storage';
import { useConnection } from '@/contexts/connectionContext';


export default function RecordFishList() {
    const router = useRouter();
    const fishRecordService = new FishRecordService()
    const [fishRecordList, setFishRecordList] = useState<FishRecord[]>()
    const [fishRecord, setFishRecord] = useState<FishRecord>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const { setLoading } = useLoading();
    const { setLastSync } = useConnection();

    useEffect(() => {
        getFishRecordList()
    }, [])

    const getFishRecordList = async () => {
        setLoading(true)
        const result = await fishRecordService.getAllFishRecord()
        if (!result.success) {
            Alert.alert("Erro", result.message, [
                { text: 'OK', onPress: () => router.back() },
            ])
            return
        }
        setFishRecordList(result.data)
        setLoading(false)

    }

    const synchronizeFishRecord = async (item: FishRecord) => {
        try {
            if (item.synchronized) {
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
            const pendingSync = fishRecordList?.filter(item => !item.synchronized) || [];

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


    return (
        <View style={styles.container}>
            {fishRecord && <ModalViewScore fishRecord={fishRecord} setShowModal={setShowModal} showModal={showModal} handleConfirmSubmit={synchronizeFishRecord} qrRef={""} />}
            <View style={styles.header}>
                <Ionicons name="browsers" size={60} color="#FB4803" />
                <Text style={styles.title}>Lista de Pontuação</Text>
                <Text style={styles.subtitle}>Historico dos Registros de Pontuações</Text>
            </View>
            {fishRecordList?.length ? (
                <SafeAreaView style={styles.container}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}

                    >
                        <View style={styles.cardList}>
                            {fishRecordList.map((item: FishRecord) => {
                                return (
                                    <TouchableOpacity style={styles.cardItem} key={item.code} onPress={() => handleModal(item)} >
                                        <View style={styles.row} >
                                            <Text style={styles.cardText}>ID:</Text>
                                            <Text style={[styles.cardText, { fontWeight: "bold" }]}>{item.code}</Text>
                                        </View>
                                        <View style={styles.row} >
                                            <Text style={styles.cardText}>Sincronizado:</Text>
                                            <Text style={[styles.cardText, { fontWeight: "bold", color: item.synchronized ? "green" : "red" }]}>{item.synchronized ? "Sim" : "Não"}</Text>
                                        </View>
                                        <View style={styles.row} >
                                            <Text style={styles.cardText}>Código do Time:</Text>
                                            <Text style={[styles.cardText, { fontWeight: "bold" }]}>{item.team}</Text>
                                        </View>
                                        <View style={styles.row} >
                                            <Text style={styles.cardText}>Nº Ficha:</Text>
                                            <Text style={[styles.cardText, { fontWeight: "bold" }]}>{item.card_number}</Text>
                                        </View>
                                        <View style={styles.row} >
                                            <Text style={styles.cardText}>Espécie: </Text>
                                            <Text style={[styles.cardText, { fontWeight: "bold" }]}>{item.species_id}</Text>
                                        </View>
                                        <View style={styles.row} >
                                            <Text style={styles.cardText}>Tamanho:</Text>
                                            <Text style={[styles.cardText, { fontWeight: "bold" }]}>{item.size} Cm</Text>
                                        </View>
                                        <View style={styles.row} >
                                            <Text style={styles.cardText}>Pontuação:</Text>
                                            <Text style={[styles.cardText, { fontWeight: "bold" }]}>{item.total_points} Pts</Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={styles.cardText}>
                                                Foto da Ficha:
                                            </Text>
                                            <Text style={styles.cardText}>
                                                {item.card_image ? '✓' : 'x'}
                                            </Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={styles.cardText}>
                                                Foto do Peixe:
                                            </Text>
                                            <Text style={styles.cardText}>
                                                {item.fish_image ? '✓' : 'x'}
                                            </Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={styles.cardText}>
                                                Vídeo da soltura:
                                            </Text>
                                            <Text style={styles.cardText}>
                                                {item.fish_video ? '✓' : 'x'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                            <TouchableOpacity
                                style={styles.modalButtonPrimary}
                                onPress={synchronizeAllFishRecord}
                            >
                                <Text style={styles.modalButtonPrimaryText}>Sincronizar Tudo</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            ) : <Text style={[styles.subtitle, { marginTop: 60 }]} >Nenhum Registro Salvo ainda...</Text>}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFE4C0' },
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: "center" },
    header: { alignItems: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#FB4803', marginTop: 12 },
    subtitle: { fontSize: 16, color: '#475569', marginTop: 8, textAlign: 'center' },
    cardList: {
        maxWidth: 450,
        padding: 5,
        width: "90%"
    },
    cardItem: {
        width: "100%",
        padding: 10,
        margin: 5,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius: 15,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },

    cardText: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "45%",
        marginBottom: 5
    },

    modalButtonPrimary: {
        backgroundColor: '#FB4803',
        borderRadius: 8,
        padding: 12,
        marginTop: 10
    },
    modalButtonPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});
