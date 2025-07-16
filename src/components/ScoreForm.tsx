import { Ionicons } from "@expo/vector-icons";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    Alert,
    Image,
} from "react-native";
import { Select } from "./Select";
import { FishData, FishRecord, Members } from "../assets/types";
import { useCallback, useEffect, useState } from "react";
import { FishService } from "../services/controller";


interface ScoreFormProps {
    fishRecord: FishRecord;
    setFishRecord: React.Dispatch<React.SetStateAction<FishRecord>>;
    teamMembers: Members[]
}

export function ScoreForm({ fishRecord, setFishRecord, teamMembers }: ScoreFormProps) {
    const fishService = new FishService()
    const [fishSpecies, setFishSpecies] = useState<FishData[]>([])
    const [errors, setErrors] = useState({
        species: false,
        size: false,
        ticketNumber: false,
        teamMember: false,
    });

    useEffect(() => {
        getFishList()
    }, [])

    const getFishList = async () => {
        const response = await fishService.getFishList()
        setFishSpecies(response.data)
        if (!response.success) {
            Alert.alert('Erro ao Buscar os Peixes', response.message);
            return;
        }
    }

    // Funções otimizadas para atualizar o estado
    const handleChange = useCallback(
        (key: keyof FishRecord, value: string) => {
            setFishRecord((prev) => ({ ...prev, [key]: value }));
            setErrors((prev) => ({ ...prev, [key]: false }));
        },
        [setFishRecord]
    );

    const findFishById = () => {
        return fishSpecies.find((item) => item.id.toString() === String(fishRecord.species));
    }

    return (
        <View style={styles.card}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="fish-sharp" size={24} color="#2563eb" />
                        <Text style={styles.cardTitle}>Dados do Peixe</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Espécie do Peixe <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            <View
                                style={[
                                    styles.pickerContainer,
                                    errors.species && styles.errorBorder,
                                ]}
                            >
                                <Select
                                    onValueChange={(value) =>
                                        handleChange("species", String(value))
                                    }
                                    options={fishSpecies.map((fish) => ({
                                        label: fish.species,
                                        value: fish.id,
                                    }))}
                                    selectedValue={fishRecord.species || ""}
                                    placeholder="Selecione a espécie do peixe"
                                />
                            </View>
                            {errors.species && (
                                <Text style={styles.errorText}>Espécie é obrigatória.</Text>
                            )}
                        </View>

                        {fishRecord.species && (
                            <Image
                                source={{ uri: findFishById()?.photo || "" }}
                                style={styles.mediaPreview}
                            />
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Tamanho (CM) <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, errors.size && styles.errorBorder]}
                                placeholder="Ex: 35"
                                placeholderTextColor="#9ca3af"
                                value={fishRecord.size}
                                onChangeText={(value) => handleChange("size", value)}
                                keyboardType="numeric"
                                accessibilityLabel="Digite o tamanho do peixe em centímetros"
                                importantForAccessibility="yes"
                            />
                            {errors.size && (
                                <Text style={styles.errorText}>Tamanho é obrigatório.</Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Número da Ficha <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, errors.ticketNumber && styles.errorBorder]}
                                placeholder="Ex: 001"
                                placeholderTextColor="#9ca3af"
                                value={fishRecord.ticketNumber}
                                keyboardType="numeric"
                                onChangeText={(value) => handleChange("ticketNumber", value)}
                                accessibilityLabel="Digite o número da ficha"
                                importantForAccessibility="yes"

                            />
                            {errors.ticketNumber && (
                                <Text style={styles.errorText}>Número da ficha é obrigatório.</Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Membro da Equipe <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            <View
                                style={[
                                    styles.pickerContainer,
                                    errors.teamMember && styles.errorBorder,
                                ]}
                            >
                                <Select
                                    onValueChange={(value) =>
                                        handleChange("teamMember", String(value))
                                    }
                                    options={teamMembers.map((member) => ({
                                        label: member.name,
                                        value: member.id,
                                    }))}
                                    selectedValue={fishRecord.teamMember || ""}
                                    placeholder="Selecione o membro da equipe"
                                />
                            </View>
                            {errors.teamMember && (
                                <Text style={styles.errorText}>Membro da equipe é obrigatório.</Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
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
        width: "auto",
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
        objectFit: "contain"
    },
});
