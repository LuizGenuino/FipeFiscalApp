import { AuthService } from "@/services/controller";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { COLORS } from "../../constants/Colors";
import { ConnectionProvider } from "@/contexts/connectionContext";
import AppBar from "@/components/AppBar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, View, StyleSheet } from "react-native";

export default function TabsLayout() {
    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        (async () => {
            const response: any = await new AuthService().getUser();
            const storedUser = response.data?.inspectorName;
            const success = response.success;
            setUser(storedUser || null);
            setSuccess(success || null);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return null;
    }

    if (!user || !success) {
        return <Redirect href={"/(auth)/sign-in" as any} />;
    }

    // Calcula a altura da tab bar considerando a barra de navegação do Android
    const tabBarHeight = Platform.OS === 'android'
        ? 70 + insets.bottom
        : 80;

    return (
        <ConnectionProvider>
            <View style={styles.container}>
                <SafeAreaView
                    style={styles.safeArea}
                    edges={['top', 'left', 'right']}
                >
                    <AppBar />
                    <Tabs
                        screenOptions={{
                            headerShown: false,
                            tabBarActiveTintColor: COLORS.primary,
                            tabBarInactiveTintColor: COLORS.textLight,
                            tabBarStyle: {
                                backgroundColor: COLORS.white,
                                borderTopColor: COLORS.border,
                                borderTopWidth: 1,
                                paddingBottom: Platform.OS === 'android' ? insets.bottom + 8 : 8,
                                paddingTop: 8,
                                height: tabBarHeight,
                                // Garante que a tab bar fique acima de tudo
                                position: 'relative',
                                zIndex: 1000,
                            },
                            tabBarLabelStyle: {
                                fontSize: 12,
                                fontWeight: "600",
                                marginBottom: Platform.OS === 'android' ? 4 : 0,
                            },
                        }}
                    >
                        <Tabs.Screen
                            name="index"
                            options={{
                                title: "Buscar Time",
                                tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
                            }}
                        />
                        <Tabs.Screen
                            name="RecordFishList"
                            options={{
                                title: "Historico de Registro",
                                tabBarIcon: ({ color, size }) => <Ionicons name="folder" size={size} color={color} />,
                            }}
                        />
                        <Tabs.Screen
                            name="RegisterScore"
                            options={{
                                tabBarItemStyle: { display: 'none' }
                            }}
                        />
                    </Tabs>
                </SafeAreaView>
            </View>
        </ConnectionProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});