import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useConnection } from '../contexts/connectionContext';
import { AuthService } from '../services/controller';
import { getLastSync } from '../services/storage';

export default function AppBar() {
    const router = useRouter();
    const authService = new AuthService();
    const { connected, lastSync, setLastSync } = useConnection();
    const [inspectorName, setInspectorName] = useState("")
    const pathname = usePathname();

    const isSearchTeamPage = pathname === "/SearchTeam"



    useEffect(() => {
        initialize()

    }, []);

    useEffect(() => {
        (async () => {
            const data: any = await getLastSync()
            const parsedData = JSON.parse(data);
            setLastSync(parsedData)
        })()
    }, [])

    const initialize = async () => {
        await checkAuth();
    }


    const checkAuth = async () => {
        const response = await authService.getUser();

        if (!response.success || !response.data.inspectorName) {
            await logOut()
        }
        setInspectorName(response.data.inspectorName)

    };

    const logOut = async () => {
        await authService.Logout()
        router.push('/(auth)/sign-in');
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
                <TouchableOpacity onPress={() => router.push('/RecordFishList')}>
                    <Ionicons name="menu" size={36} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.statusBar}>
                <View style={styles.container}>
                    <Text>Conexão:</Text>
                    <View
                        style={[
                            styles.dot,
                            { backgroundColor: connected ? '#22c55e' : '#ef4444' }, // verde ou vermelho
                        ]}
                    />
                </View>
                <Text> Sincronizado em: {lastSync || ""}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: '#FB4803',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
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
        backgroundColor: '#FFE4C0',
    },

    buttonBack: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 5
    },

    container: {
        flexDirection: "row",
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginLeft: 4
    },
})
