import { AuthService } from "@/services/controller";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { COLORS } from "../../constants/Colors";
import { ConnectionProvider } from "@/contexts/connectionContext";
import AppBar from "@/components/AppBar";

export default function TabsLayout() {
    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // <-- controle de carregamento



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
        return null; // ou <LoadingScreen />
    }

    if (!user || !success) {
        return <Redirect href={"/(auth)/sign-in" as any} />;
    }

    return (

        <ConnectionProvider>
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
                        paddingBottom: 8,
                        paddingTop: 8,
                        height: 80,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "600",
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
                        tabBarItemStyle: { display: 'none' } // A forma mais atual de esconder a barra
                    }}
                />
            </Tabs>
        </ConnectionProvider>
    );
};