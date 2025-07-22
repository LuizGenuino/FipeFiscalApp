import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from '@react-native-community/netinfo';

type ConnectionContextType = {
    connected: boolean;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const hasInternet = !!(state.isConnected && state.isInternetReachable);
            setConnected(hasInternet);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <ConnectionContext.Provider value={{ connected }}>
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    const context = useContext(ConnectionContext);
    if (!context) {
        throw new Error("useConnection must be used within a ConnectionProvider");
    }
    return context;
}
