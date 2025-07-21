// app/_layout.tsx
import { Stack } from "expo-router";
import { LoadingProvider } from "@/src/contexts/LoadingContext";
import LoadingModal from "@/src/components/LoadingModal";

export default function RootLayout() {
    return (
        <LoadingProvider>
            <LoadingModal />
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
                    options={{ title: "Registrar Pontuação", headerBackTitle: "Voltar" }}
                />
            </Stack>
        </LoadingProvider>
    );
}
