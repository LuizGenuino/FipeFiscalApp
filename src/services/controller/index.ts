import { ApiResponse, ControllerResponse, fishOfflineStorage, LoginData, OfflineStorageData, TeamsOfflineStorage } from "@/src/assets/types";
import { ApiService } from "../api";
import { storeUser } from "../storage";
import OfflineStorage from "../sql";
import NetInfo from '@react-native-community/netinfo';


const offlineStorage = new OfflineStorage();

export async function LoginService(data: LoginData): Promise<ControllerResponse> {
    try {
        const apiService = new ApiService('/login')

        const response: ApiResponse = await apiService.post(data);

        await storeUser(response?.data);

        return {
            success: true,
            message: "Login Realizado com Sucesso!",
            data: response?.data,
        }
    } catch (error: Error | any) {
        console.error('Login error:', error);
        return {
            success: false,
            message: error?.message || 'Erro ao realizar login',
            data: null,
        }

    }
}

export async function getTeamsService(): Promise<ControllerResponse> {

    try {
        let isConnected = false;
        NetInfo.fetch().then(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            isConnected = state.isConnected || false;
        });

        if (!isConnected) {
            console.warn('No internet connection, fetching from offline storage');
            const teams = await offlineStorage.getAllTeams();
            return {
                success: true,
                message: "Equipes obtidas do armazenamento offline!",
                data: teams,
            }
        }

        const apiService = new ApiService('/teams');
        const response: ApiResponse = await apiService.get();

        console.log('Teams fetched successfully:', response?.data);

        const teams: TeamsOfflineStorage[] = response?.data.map((team: any) => ({
            id: team.id,
            code: team.code,
            team_name: team.team_name,
            id_member_1: team[0]?.id || 0,
            name_member_1: team[0]?.name || '',
            id_member_2: team[1]?.id,
            name_member_2: team[1]?.name || '',
            id_member_3: team[2]?.id,
            name_member_3: team[2]?.name || '',
            id_member_4: team[3]?.id,
            name_member_4: team[3]?.name || ''
        }));

        const offlineStorageData: OfflineStorageData = {
            column: 'teams',
            value: teams
        };

        await offlineStorage.clear("teams");
        await offlineStorage.setTeams(offlineStorageData);

        return {
            success: true,
            message: "Equipes obtidas com sucesso!",
            data: response?.data,
        }
    } catch (error: Error | any) {
        console.error('Error fetching teams:', error);
        return {
            success: false,
            message: error?.message || 'Erro ao obter equipes',
            data: null,
        }
    }
}

export async function getFishService(): Promise<ControllerResponse> {
    try {
        let isConnected = false;
        NetInfo.fetch().then(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            isConnected = state.isConnected || false;
        });

        if (!isConnected) {
            console.warn('No internet connection, fetching from offline storage');
            const fish = await offlineStorage.getAllFish();
            return {
                success: true,
                message: "Peixes obtidos do armazenamento offline!",
                data: fish,
            }
        }
        console.log('Fetching fish list from API');
        const apiService = new ApiService('/fish-list');
        const response: ApiResponse = await apiService.get();

        console.log('Fish fetched successfully:', response?.data);

        const fish: fishOfflineStorage[] = response?.data.map((fish: any) => ({
            id: fish.id,
            species: fish.species,
            photo: fish.photo,
            point: fish.point
        }));

        const offlineStorageData: OfflineStorageData = {
            column: 'fish',
            value: fish
        };
        console.log('Offline storage data for fish:', offlineStorageData);

        await offlineStorage.clear("fish");
        console.log('Cleared fish table in offline storage');
        await offlineStorage.setFish(offlineStorageData);
        console.log('Fish data stored in offline storage');

        return {
            success: true,
            message: "Equipes obtidas com sucesso!",
            data: response?.data,
        }
    } catch (error: Error | any) {
        console.error('Error fetching fish list:', error);
        return {
            success: false,
            message: error?.message || 'Erro ao obter lista de peixes',
            data: null,
        }
    }
}