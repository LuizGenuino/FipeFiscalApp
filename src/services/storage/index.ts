import AsyncStorage from "@react-native-async-storage/async-storage";

// cria função para armazenar login do usuario authenticado no AsyncStorage
export const storeUser = async (user: object): Promise<void> => {
    try {
        await AsyncStorage.setItem("loginUser@Fipe", JSON.stringify(user));
    } catch (error) {
        console.error('Error storing login:', error);
    }
}

// cria função para recuperar login do usuario autenticado do AsyncStorage
export const getUser = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem("loginUser@Fipe");
        return data;
    } catch (error) {
        console.error('Error retrieving login:', error);
        return null;
    }
}

export const clearUser = async (): Promise<any> => {
    try {
        await AsyncStorage.removeItem("loginUser@Fipe");
    } catch (error) {
        console.error('Error retrieving login:', error);
        return null;
    }
}

