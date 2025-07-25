import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUser } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useConnection } from '../contexts/connectionContext';
import { AuthService } from '../services/controller';

export default function AppBar() {
    const router = useRouter();
    const { connected } = useConnection();
    const [inspectorName, setInspectorName] = useState("")
    const [showModal, setShowModal] = useState(false)
    const pathname = usePathname();

    const isSearchTeamPage = pathname === "/SearchTeam"



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
                console.log("aqui");

                await logOut()
            }
            setInspectorName(name)
        } catch (error) {
            console.log("checkAuth error: ", error);
        }
    };

    const logOut = async () => {
        await new AuthService().Logout()
        console.log("ok");

        router.push('/');
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
                {!isSearchTeamPage && (<TouchableOpacity style={styles.buttonBack} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={25} />
                    <Text>
                        Voltar
                    </Text>
                </TouchableOpacity>)}
                <View style={styles.container}>
                    <Text>Conexão:</Text>
                    <View
                        style={[
                            styles.dot,
                            { backgroundColor: connected ? '#22c55e' : '#ef4444' }, // verde ou vermelho
                        ]}
                    />
                </View>
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
