// app/_layout.tsx
import { Stack, usePathname } from "expo-router";
import { LoadingProvider } from "@/src/contexts/LoadingContext";
import LoadingModal from "@/src/components/LoadingModal";
import AppBar from "../components/AppBar";
import { ConnectionProvider } from "../contexts/connectionContext";

export default function RootLayout() {

    const pathname = usePathname();

    console.log("pathname: ",pathname);
    
    
    const isLoginScreen = pathname === '/' || pathname === '/index' || pathname === '/Index' ;

    return (
        <ConnectionProvider>
            <LoadingProvider>
                <LoadingModal />
                {!isLoginScreen && <AppBar />}
                <Stack
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen name="Index" options={{ headerShown: false }} />
                    <Stack.Screen name="SearchTeam" options={{ headerShown: false }} />
                    <Stack.Screen name="RegisterScore" options={{ headerShown: false }}/>
                    <Stack.Screen name="RecordFishList" options={{ headerShown: false }}/>
                </Stack>
            </LoadingProvider>
        </ConnectionProvider>
    );
}
