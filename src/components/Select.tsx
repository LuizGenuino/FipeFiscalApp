import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, FlatList, View } from "react-native";


interface SelectOption {
    label: string;
    value: string | number;
}

type OnValueChange = (value: string | number) => void;

interface SelectProps {
    options: SelectOption[];
    selectedValue: string | number | null | undefined;
    onValueChange: OnValueChange;
    placeholder?: string;
}

export function Select({ options, selectedValue, onValueChange, placeholder = "Selecione uma opção" }: SelectProps) {

    const [modalVisible, setModalVisible] = useState(false);

    const selectedItem = options.find((item) => item.value.toString() === selectedValue);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.select} onPress={() => setModalVisible(true)}>
                <Text style={selectedItem ? styles.text : styles.placeholder}>
                    {selectedItem ? selectedItem.label : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    select: {
        borderWidth: 0.1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
    },
    placeholder: {
        fontSize: 16,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        maxWidth: 350,
        backgroundColor: 'white',
        borderRadius: 8,
        maxHeight: 350,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});