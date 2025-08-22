import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingModal from "@/components/LoadingModal";
import { CameraProvider } from "@/contexts/CameraContext";

export default function RootLayout() {
    return (
        <LoadingProvider>
            <CameraProvider>
                <LoadingModal />
                <SafeScreen>
                    <Slot />
                </SafeScreen>
            </CameraProvider>
        </LoadingProvider>
    );
}