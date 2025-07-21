import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { clearUser, getUser } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';

export default function AppBar() {
    const router = useRouter();
    const [inspectorName, setInspectorName] = useState("")


    useEffect(() => {
        initialize()
    }, []);

    const initialize = async () => {
        await checkAuth();
    }


    const checkAuth = async () => {
        try {
            const userAuth: any = await getUser();
            const name = JSON.parse(userAuth)?.inspectorName
            if (!userAuth || !name) {
                await logOut()
            }
            setInspectorName(name)
        } catch (error) {
            console.log("checkAuth error: ", error);
        }
    };

    const logOut = async () => {
        try {
            await clearUser()
            router.push('/');
        } catch (error) {
            console.log("logOut error: ", error);

        }
    }

    return (
        <View>
            <View style={styles.appBar}>
                <TouchableOpacity style={styles.button} onPress={logOut}>
                    <Ionicons name="exit-outline" size={20} color="#fff" style={styles.iconBtn} />
                    <Text style={{ color: 'white' }}>
                        Sair
                    </Text>
                </TouchableOpacity>
                <Text style={styles.textName}> | {inspectorName}</Text>
                <TouchableOpacity onPress={logOut}>
                    <Ionicons name="menu" size={36} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.statusBar}>
                <TouchableOpacity style={styles.buttonBack} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={25} />
                    <Text>
                        Voltar
                    </Text>
                </TouchableOpacity>
                <Text>Conexão: { }</Text>
                <Text> Sincronizado em: { }</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: '#2563eb',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingTop: 40
    },

    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },

    textName: {
        color: 'white',
        fontWeight: 'bold',
        margin: "auto",
        marginLeft: 0
    },

    iconBtn: {
        marginRight: 5,
    },

    statusBar: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        backgroundColor: '#f0f9ff',
    },

    buttonBack: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 5
    }
})
