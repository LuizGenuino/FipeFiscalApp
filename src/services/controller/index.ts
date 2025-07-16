import {
    ApiResponse,
    ControllerResponse,
    FishData,
    LoginData,
    OfflineStorageData,
    TeamsOfflineStorage,
} from "@/src/assets/types";
import { ApiService } from "../api";
import { clearUser, storeUser } from "../storage";
import OfflineStorage from "../sql";
import NetInfo from '@react-native-community/netinfo';

const offlineStorage = new OfflineStorage();

async function isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return !!state.isConnected;
}

function serializeTeams(data: any): TeamsOfflineStorage[] {
    return data.map((team: any) => ({
        id: team.id,
        code: team.code,
        team_name: team.team_name,
        id_member_1: team.members[0]?.id || 0,
        name_member_1: team.members[0]?.name || '',
        id_member_2: team.members[1]?.id,
        name_member_2: team.members[1]?.name || '',
        id_member_3: team.members[2]?.id,
        name_member_3: team.members[2]?.name || '',
        id_member_4: team.members[3]?.id,
        name_member_4: team.members[3]?.name || '',
    }));
}

function serializeFish(data: any[]): FishData[] {
    return data.map((fish: any) => ({
        id: fish.id,
        species: fish.species,
        photo: fish.photo,
        point: fish.point,
    }));
}

export class AuthService {
    async Login(data: LoginData): Promise<ControllerResponse> {
        try {
            const apiService = new ApiService('/login');
            const response: ApiResponse = await apiService.post(data);
            await storeUser(response?.data);

            return {
                success: true,
                message: "Login realizado com sucesso!",
                data: response?.data,
            };
        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao realizar login',
                data: null,
            };
        }
    }

    async Logout() {
        try {
            await clearUser()
        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao realizar logout',
                data: null,
            };
        }
    }
}

export class TeamsService {
    async getAllTeams(): Promise<ControllerResponse> {
        try {
            if (!(await isOnline())) {
                const teams = await offlineStorage.getAllTeams();
                return {
                    success: true,
                    message: "Equipes obtidas do armazenamento offline!",
                    data: teams,
                };
            }

            const apiService = new ApiService('/teams');
            const response: ApiResponse = await apiService.get();

            const teams = serializeTeams(response?.data);
            console.log("data formatado", teams);
            
            const offlineData: OfflineStorageData = {
                column: 'teams',
                value: teams,
            };

            await offlineStorage.setTeams(offlineData);

            return {
                success: true,
                message: "Equipes obtidas com sucesso!",
                data: response?.data,
            };
        } catch (error: any) {
            console.error('Erro ao buscar equipes:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao obter as equipes',
                data: null,
            };
        }
    }

    async getTeamByCode(code: string): Promise<ControllerResponse> {
        try {
            const team = await offlineStorage.getTeamByCode(code);
            return {
                success: true,
                message: "Equipe obtida do armazenamento offline!",
                data: team,
            };
        } catch (error: any) {
            console.error('Erro ao busca a equipe:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao obter a equipe',
                data: null,
            };
        }
    }
}

export class FishService {
    async getFishList(): Promise<ControllerResponse> {
        try {
            if (!(await isOnline())) {
                const fish = await offlineStorage.getAllFish();
                return {
                    success: true,
                    message: "Peixes obtidos do armazenamento offline!",
                    data: fish,
                };
            }

            const apiService = new ApiService('/fish-list');
            const response: ApiResponse = await apiService.get();

            const fish = serializeFish(response?.data);
            const offlineData: OfflineStorageData = {
                column: 'fish',
                value: fish,
            };

            await offlineStorage.setFish(offlineData);

            return {
                success: true,
                message: "Peixes obtidos com sucesso!",
                data: response?.data,
            };
        } catch (error: any) {
            console.error('Erro ao buscar peixes:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao obter lista de peixes',
                data: null,
            };
        }
    }
}
