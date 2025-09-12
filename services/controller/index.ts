import {
    ApiResponse,
    ControllerResponse,
    FishData,
    FishRecord,
    LoginData,
} from "@/assets/types";
import { ApiService } from "../api";
import { clearUser, getUser, storeLastSync, storeUser } from "../storage";
import NetInfo from '@react-native-community/netinfo';
import OfflineStorage from "../sql";

// Remove a instanciação direta - usaremos getInstance() assincrono
let offlineStorage: OfflineStorage | null = null;

async function getOfflineStorage(): Promise<OfflineStorage> {
    if (!offlineStorage) {
        offlineStorage = await OfflineStorage.getInstance();
    }
    return offlineStorage;
}


async function isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && state.isInternetReachable);
}

// Serviço para sincronização em background
class SyncService {
    private isSyncing = false;

    async trySyncPendingRecords() {
        if (this.isSyncing) return;

        this.isSyncing = true;
        try {
            const storage = await getOfflineStorage();
            const pendingRecords = await storage.getUnsynchronizedDataRecords();

            if (pendingRecords.length === 0) {
                await storeLastSync();
                return;
            }

            const online = await isOnline();
            if (!online) {
                return;
            }


            for (const record of pendingRecords) {
                try {
                    let response: any
                    if (record.modality === 'Barranco') {
                        response = await ApiService.barranco.enviarDados(record)
                    } else {
                        response = await ApiService.embarcada.enviarDados(record)
                    }

                    if (response.status === 200 || response.status === 201) {
                        await storage.markAsSynchronizedData(record.code);
                        console.log(`Registro ${record.code} sincronizado com sucesso`);
                    }
                } catch (error) {
                    console.error(`Erro ao sincronizar registro ${record.code}:`, error);
                    // Continua com os próximos registros mesmo se um falhar
                }
            }
            await storeLastSync();
        } catch (error) {
            console.error('Erro no processo de sincronização:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    async trySyncPendingMedias() {
        if (this.isSyncing) return;

        this.isSyncing = true;
        try {
            const storage = await getOfflineStorage();
            const pendingRecords = await storage.getUnsynchronizedMediaRecords();

            if (pendingRecords.length === 0) {
                return;
            }

            const online = await isOnline();
            if (!online) {
                return;
            }


            for (const record of pendingRecords) {
                try {
                    let response: any
                    if (record.modality === 'Barranco') {
                        response = await ApiService.barranco.enviarMidias(record)
                    } else {
                        response = await ApiService.embarcada.enviarMidias(record)
                    }

                    if (response.status === 200 || response.status === 201) {
                        await storage.markAsSynchronizedMedia(record.code);
                        console.log(`Midia do registro ${record.code} sincronizado com sucesso`);
                    }
                } catch (error) {
                    console.error(`Erro ao sincronizar midia do registro ${record.code}:`, error);
                    // Continua com os próximos registros mesmo se um falhar
                }
            }
            await storeLastSync();
        } catch (error) {
            console.error('Erro no processo de sincronização de midia:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}

const syncService = new SyncService();

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
    private async getStorage(): Promise<OfflineStorage> {
        return await getOfflineStorage();
    }

    async setFishRecord(data: FishRecord): Promise<ControllerResponse> {
        data.size = +data.size;

        try {
            const storage = await this.getStorage();

            await storage.setFishRecord(data);

            return {
                success: true,
                message: "Pontuação Cadastrada Com Sucesso",
                data: null
            };

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
        data.size = +data.size;

        try {
            const online = await isOnline();
            if (!online) {
                return {
                    success: false,
                    message: "Sem Acesso a Internet!",
                    data: null
                };
            }

            const storage = await this.getStorage();
            let response: any
            if (data.modality === 'Barranco') {
                response = await ApiService.barranco.enviarDados(data)
            } else {
                response = await ApiService.embarcada.enviarDados(data)
            }

            if (response.status === 200 || response.status === 201) {
                await storage.markAsSynchronizedData(data.code);

                return {
                    success: true,
                    message: "Pontuação Sincronizada Com Sucesso",
                    data: null
                };
            } else {
                return {
                    success: false,
                    message: "Erro na resposta da API",
                    data: null
                };
            }

        } catch (error: any) {
            console.error('Erro ao Sincronizar Pontuação:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao Sincronizar Pontuação',
                data: null,
            };
        }
    }

    async synchronizeFishRecordMedia(data: FishRecord): Promise<ControllerResponse> {
        try {
            const online = await isOnline();
            if (!online) {
                return {
                    success: false,
                    message: "Sem Acesso a Internet!",
                    data: null
                };
            }

            const storage = await this.getStorage();
            let response: any
            if (data.modality === 'Barranco') {
                response = await ApiService.barranco.enviarMidias(data)
            } else {
                response = await ApiService.embarcada.enviarMidias(data)
            }

            if (response.status === 200 || response.status === 201) {
                await storage.markAsSynchronizedMedia(data.code);

                return {
                    success: true,
                    message: "Midias Sincronizadas Com Sucesso",
                    data: null
                };
            } else {
                return {
                    success: false,
                    message: "Erro na resposta da API",
                    data: null
                };
            }

        } catch (error: any) {
            console.error('Erro ao Sincronizar Pontuação:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao Sincronizar Pontuação',
                data: null,
            };
        }
    }

    async getAllFishRecord(): Promise<ControllerResponse> {
        try {
            const storage = await this.getStorage();
            const fishRecords = await storage.getAllFishRecords();

            return {
                success: true,
                message: "Pontuações obtidas com Sucesso!",
                data: fishRecords,
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

    async getPendingSyncRecords(): Promise<ControllerResponse> {
        try {
            const storage = await this.getStorage();
            const pendingRecords = await storage.getUnsynchronizedDataRecords();

            return {
                success: true,
                message: "Registros pendentes obtidos com sucesso",
                data: pendingRecords,
            };

        } catch (error: any) {
            console.error('Erro ao buscar registros pendentes:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao obter registros pendentes',
                data: null,
            };
        }
    }

    async trySyncAllPending(): Promise<ControllerResponse> {
        try {
            await syncService.trySyncPendingRecords();

            return {
                success: true,
                message: "Sincronização iniciada",
                data: null,
            };

        } catch (error: any) {
            console.error('Erro ao iniciar sincronização:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao iniciar sincronização',
                data: null,
            };
        }
    }

    async trySyncAllMedia(): Promise<ControllerResponse> {
        try {
            await syncService.trySyncPendingMedias();

            return {
                success: true,
                message: "Sincronização de midias iniciada",
                data: null,
            };

        } catch (error: any) {
            console.error('Erro ao iniciar sincronização de midias:', error);
            return {
                success: false,
                message: error?.message || 'Erro ao iniciar sincronização midias',
                data: null,
            };
        }
    }
}

// Sincronização periódica a cada 10 minutos
setInterval(() => syncService.trySyncPendingRecords(), 10 * 60 * 1000);