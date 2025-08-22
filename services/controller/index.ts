import {
    ApiResponse,
    ControllerResponse,
    FishData,
    FishRecord,
    LoginData,
} from "@/assets/types";
import { ApiService } from "../api";
import { clearUser, getUser, storeUser } from "../storage";
import OfflineStorage from "../sql";
import NetInfo from '@react-native-community/netinfo';


const offlineStorage = new OfflineStorage();

async function isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && state.isInternetReachable);
}



export class AuthService {
    async Login(data: LoginData): Promise<ControllerResponse> {
        try {
            await storeUser({ inspectorName: data.inspectorName });

            return {
                success: true,
                message: "Login realizado com sucesso!",
                data: null,
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

    async Logout(): Promise<ControllerResponse> {
        try {
            await clearUser()
            return {
                success: true,
                message: "Log Out Realizado Com sucesso",
                data: null,
            }
        } catch (error: any) {
            console.error('logout error:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao tentar Sair',
                data: null,
            };
        }
    }

    async getUser(): Promise<ControllerResponse> {
        try {
            const data: any = await getUser()
            if (!data) {
                return {
                    success: false,
                    message: "Usuário não encontrado",
                    data: null,
                };
            }
            const parsedData = JSON.parse(data);
            return {
                success: true,
                message: "Usuário obtido com sucesso",
                data: parsedData,
            };
        } catch (error: any) {
            console.error('Erro ao obter usuário:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao obter usuário',
                data: null,
            };
        }
    }
}

export class FishRecordService {
    async setFishRecord(data: FishRecord): Promise<ControllerResponse> {
        data.size = +data.size
        try {
            await offlineStorage.setFishRecord(data)
            // if ((await isOnline())) {
            //     const apiService = new ApiService('/fish_catch');
            //     const response: any = await apiService.post(data);
            //     console.log("response api: ", response);
            //     if (response.status === 200 || response.status === 201) {
            //         data.synchronized = true
            //         await offlineStorage.updateFishRecord(data)
            //     } 
            // }

            return {
                success: true,
                message: "Pontuação Cadastrada Com Sucesso",
                data: null
            }


        } catch (error: any) {
            console.error('Erro ao Salvar Pontuação da Equipe:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao Salvar Pontuação da Equipe',
                data: null,
            };
        }
    }

    async synchronizeFishRecord(data: FishRecord): Promise<ControllerResponse> {
        data.size = +data.size
        try {
            // if ((await isOnline())) {
            //     const apiService = new ApiService('/fish_catch');
            //     const response: any = await apiService.post(data);
            //     console.log("response api: ", response);
            //     if (response.status === 200 || response.status === 201) {
            //         data.synchronized = true
            //         await offlineStorage.updateFishRecord(data)
            //     }
            // } else {
            //     return {
            //         success: false,
            //         message: "Sem Acesso a Internet!",
            //         data: null
            //     }
            // }

            return {
                success: true,
                message: "Pontuação Sincronizada Com Sucesso",
                data: null
            }


        } catch (error: any) {
            console.error('Erro ao Salvar Pontuação da Equipe:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao Salvar Pontuação da Equipe',
                data: null,
            };
        }
    }

    async getAllFishRecord(): Promise<ControllerResponse> {
        try {

            const FishRecord = await offlineStorage.getAllFishRecord();
            return {
                success: true,
                message: "Pontuações obtidas com Sucesso!",
                data: FishRecord,
            };

        } catch (error: any) {
            console.error('Erro ao buscar pontuações:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao obter as pontuações',
                data: null,
            };

        }
    }

}

