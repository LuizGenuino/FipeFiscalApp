
import { AuthService } from "@/services/controller";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function AuthRoutesLayout() {
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

    if (user && success) {
        return <Redirect href="/" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
