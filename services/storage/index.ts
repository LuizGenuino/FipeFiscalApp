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


// cria função para armazenar login do usuario authenticado no AsyncStorage
export const storeLastSync = async (): Promise<void> => {
    try {
        await AsyncStorage.setItem("lastSync@Fipe", JSON.stringify(new Date().toLocaleString()));
    } catch (error) {
        console.error('Error storing login:', error);
    }
}

// cria função para recuperar login do usuario autenticado do AsyncStorage
export const getLastSync = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem("lastSync@Fipe");
        return data;
    } catch (error) {
        console.error('Error retrieving login:', error);
        return null;
    }
}

export const clearLastSync = async (): Promise<any> => {
    try {
        await AsyncStorage.removeItem("lastSync@Fipe");
    } catch (error) {
        console.error('Error retrieving login:', error);
        return null;
    }
}

// cria função para armazenar login do usuario authenticado no AsyncStorage
export const storeModality = async (modality: object): Promise<void> => {
    try {
        await AsyncStorage.setItem("modality@Fipe", JSON.stringify(modality));
    } catch (error) {
        console.error('Error storing login:', error);
    }
}

// cria função para recuperar login do usuario autenticado do AsyncStorage
export const getModality = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem("modality@Fipe");
        return data;
    } catch (error) {
        console.error('Error retrieving login:', error);
        return null;
    }
}

export const clearModality = async (): Promise<any> => {
    try {
        await AsyncStorage.removeItem("modality@Fipe");
    } catch (error) {
        console.error('Error retrieving login:', error);
        return null;
    }
}

