import AsyncStorage from "@react-native-async-storage/async-storage";

// cria função para armazenar login do usuario authenticado no AsyncStorage
export const storeUser = async (user: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('login', user);
        console.log('Login stored successfully');
    } catch (error) {
        console.error('Error storing login:', error);
    }
}

// cria função para recuperar login do usuario autenticado do AsyncStorage
export const getUser = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem('login');
       return data;
    } catch (error) {
        console.error('Error retrieving login:', error);
        return null;
    }
}