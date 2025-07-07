import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { FishRecord } from "../app";
import { Select } from "./Select";

const fishSpecies = [
    'Tucunaré',
    'Dourado',
    'Pintado',
    'Pacu',
    'Traíra',
    'Corvina',
    'Robalo',
    'Bagre',
    'Lambari',
    'Outros'
];

const teamMembers = ['Membro 1', 'Membro 2', 'Membro 3', 'Membro 4'];

interface ScoreFormProps {
    fishRecord: FishRecord;
    setFishRecord: React.Dispatch<React.SetStateAction<FishRecord>>;
}

export function ScoreForm({ fishRecord, setFishRecord }: ScoreFormProps) {

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
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="fish-sharp" size={24} color="#2563eb" />
                        <Text style={styles.cardTitle}>Dados do Peixe</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Espécie do Peixe *</Text>
                            <View style={styles.pickerContainer}>
                                <Select
                                    onValueChange={(value: string | number) => setFishRecord((prev: FishRecord) => ({ ...prev, species: String(value) }))}
                                    options={fishSpecies.map(species => ({ label: species, value: species }))}
                                    selectedValue={fishRecord.species || ''}
                                    placeholder="Selecione a espécie do peixe"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tamanho (CM) *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 35"
                                value={fishRecord.size}
                                onChangeText={(value) => setFishRecord((prev: FishRecord) => ({ ...prev, size: value }))}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Número da Ficha *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 001"
                                value={fishRecord.ticketNumber}
                                onChangeText={(value) => setFishRecord((prev: FishRecord) => ({ ...prev, ticketNumber: value }))}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Membro da Equipe *</Text>
                            <View style={styles.pickerContainer}>
                                <Select
                                    onValueChange={(value: string | number) => setFishRecord((prev: FishRecord) => ({ ...prev, teamMember: String(value) }))}
                                    options={teamMembers.map(member => ({ label: member, value: member }))}
                                    selectedValue={fishRecord.teamMember || ''}
                                    placeholder="Selecione o membro da equipe"
                                />
                            </View>
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
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 8,
    },
    cardContent: {
        padding: 16,
    },
    infoText: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
});