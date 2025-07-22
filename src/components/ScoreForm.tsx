import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Image,
} from "react-native";
import { Select } from "./Select";
import { FishData, FishRecord, RootStackParamList } from "../assets/types";
import { useCallback, useEffect, useState } from "react";
import { getUser } from "../services/storage";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SearchTeam">;

interface ScoreFormProps {
    fishRecord: FishRecord;
    setFishRecord: React.Dispatch<React.SetStateAction<FishRecord>>;
}

const fishSpecies: FishData[] = [
    { species: "Barbado", point: 30, photo: require("@/assets/images/Barbado.png") },
    { species: "Piraputanga", point: 50, photo: require("@/assets/images/Piraputanga.png") },
    { species: "Jurupoca", point: 50, photo: require("@/assets/images/Jurupoca.png") },
    { species: "Pintado", point: 70, photo: require("@/assets/images/Pintado.png") },
    { species: "Cachara", point: 70, photo: require("@/assets/images/Cachara.png") },
    { species: "Jaú", point: 70, photo: require("@/assets/images/Jaú.png"), minimumSize: 40 },
    { species: "Pacu", point: 100, photo: require("@/assets/images/Pacu.png") },
];

export function ScoreForm({ fishRecord, setFishRecord }: ScoreFormProps) {
    const router = useRouter();
    const [errors, setErrors] = useState({ species: false, size: false, ticketNumber: false });
    const [minimumSizeError, setMinimumSizeError] = useState("");

    useEffect(() => {
        if (!fishRecord.registered_by) getInspectorName();

        if (fishRecord.species === "Jaú" && +fishRecord.size < 40) {
            setMinimumSizeError("O tamanho mínimo do Jaú é 40cm!");
        } else if (minimumSizeError) {
            setMinimumSizeError("");
        }

        const newPoints = calculateFishingScore();
        if (newPoints !== fishRecord.point) {
            setFishRecord(prev => ({ ...prev, point: newPoints }));
        }
    }, [fishRecord]);

    const getInspectorName = async () => {
        try {
            const data: any = await getUser();
            const parsed = JSON.parse(data);
            if (!parsed?.inspectorName) {
                Alert.alert("Nome invalido", parsed?.inspectorName)
                router.push('/');
                return;
            }
            setFishRecord(prev => ({ ...prev, inspectorName: parsed.inspectorName }));
        } catch (error) {
            Alert.alert("Erro", "Não foi possível obter os dados do inspetor.");
        }
    };

    const calculateFishingScore = (): number => {
        const points = fishSpecies.find(f => f.species === fishRecord.species)?.point || 0;
        return +fishRecord.size * points;
    };

    const handleChange = useCallback(
        (key: keyof FishRecord, value: string) => {
            setFishRecord(prev => ({ ...prev, [key]: value }));
            setErrors(prev => ({ ...prev, [key]: false }));
        },
        [setFishRecord]
    );

    const selectedFish = fishSpecies.find(f => f.species === fishRecord.species);

    return (
        <View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="fish-sharp" size={24} color="#2563eb" />
                    <Text style={styles.cardTitle}>Dados do Peixe</Text>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Espécie do Peixe <Text style={{ color: "red" }}>*</Text></Text>
                        <View style={[styles.pickerContainer, errors.species && styles.errorBorder]}>
                            <Select
                                onValueChange={(val) => handleChange("species", String(val))}
                                options={fishSpecies.map(fish => ({ label: fish.species, value: fish.species }))}
                                selectedValue={fishRecord.species || ""}
                                placeholder="Selecione a espécie do peixe"
                            />
                        </View>
                        {errors.species && <Text style={styles.errorText}>Espécie é obrigatória.</Text>}
                    </View>

                    {selectedFish && <Image source={selectedFish.photo} style={styles.mediaPreview} />}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tamanho (CM) <Text style={{ color: "red" }}>*</Text></Text>
                        <TextInput
                            style={[styles.input, errors.size && styles.errorBorder]}
                            placeholder="Ex: 35"
                            placeholderTextColor="#9ca3af"
                            value={fishRecord.size.toString()}
                            onChangeText={(value) => handleChange("size", value)}
                            keyboardType="numeric"
                        />
                        {errors.size && <Text style={styles.errorText}>Tamanho é obrigatório.</Text>}
                        {minimumSizeError && <Text style={styles.errorText}>{minimumSizeError}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Número da Ficha <Text style={{ color: "red" }}>*</Text></Text>
                        <TextInput
                            style={[styles.input, errors.ticketNumber && styles.errorBorder]}
                            placeholder="Ex: 001"
                            placeholderTextColor="#9ca3af"
                            value={fishRecord.ticket_number}
                            onChangeText={(value) => handleChange("ticket_number", value)}
                            keyboardType="numeric"
                        />
                        {errors.ticketNumber && <Text style={styles.errorText}>Número da ficha é obrigatório.</Text>}
                    </View>
                </View>
            </View>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="podium" size={24} color="#2563eb" />
                    <Text style={styles.cardTitle}>Pontuação da Pesca: {fishRecord.point}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
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
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#1f2937",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    errorBorder: {
        borderColor: "#ef4444",
    },
    errorText: {
        color: "#ef4444",
        fontSize: 13,
        marginTop: 4,
    },
    mediaPreview: {
        maxWidth: "100%",
        height: 250,
    },
});
