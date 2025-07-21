// app/_layout.tsx
import { Stack, usePathname } from "expo-router";
import { LoadingProvider } from "@/src/contexts/LoadingContext";
import LoadingModal from "@/src/components/LoadingModal";
import AppBar from "../components/AppBar";

export default function RootLayout() {

    const pathname = usePathname();
    const isLoginScreen = pathname === '/';

    return (
        <LoadingProvider>
            <LoadingModal />
            {!isLoginScreen && <AppBar />}
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#2563eb",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            >
                <Stack.Screen name="Index" options={{ headerShown: false }} />
                <Stack.Screen name="SearchTeam" options={{ headerShown: false }} />
                <Stack.Screen
                    name="RegisterScore"
                    options={{ headerShown: false }}
                />
            </Stack>
        </LoadingProvider>
    );
}
