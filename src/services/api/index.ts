import { FishRecord } from "@/src/assets/types";
import { getUser } from "../storage";
import * as FileSystem from 'expo-file-system';
import axios, { AxiosResponse, AxiosError } from 'axios';
import mime from 'mime';
import { Platform } from "react-native";
import RNFetchBlob from 'react-native-blob-util';

const API_BASE_URL_EMBARCADA = process.env.EXPO_PUBLIC_API_URL_EMBARCADA;
const API_BASE_URL_BARRANCO = process.env.EXPO_PUBLIC_API_URL_BARRANCO;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || ""

// Configuração global do Axios para melhor tratamento de erros
axios.interceptors.request.use(config => {
    console.log('Request Interceptor:', config);
    return config;
}, error => {
    console.error('Request Error Interceptor:', error);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    console.log('Response Interceptor:', response);
    return response;
}, error => {
    console.error('Response Error Interceptor:', error);
    return Promise.reject(error);
});

async function prepareFile(uri: string, fieldName: string, record: FishRecord) {
    try {
        if (!uri) return null;

        if (!uri.startsWith("file://")) {
            uri = `file://${uri}`;
        }

        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
            console.warn(`Arquivo não encontrado: ${uri}`);
            return null;
        }

        const type = mime.getType(uri) || 'application/octet-stream';

        return {
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            type,
            name: `${record.team}_${fieldName}_${record.code}.${mime.getExtension(type) || 'file'}`,
        };
    } catch (error) {
        console.error(`Erro ao preparar arquivo ${fieldName}:`, error);
        return null;
    }
}

// Função para criar FormData (com pequenos ajustes)
async function toFilteredFormData(record: FishRecord): Promise<FormData> {
    const allowedKeys = [
        "size", "card_image", "code", "fish_image", "latitude", "longitude",
        "registered_by", "fish_video", "card_number", "team", "species_id"
    ];

    const fileFields = ["card_image", "fish_image", "fish_video"];
    const formData = new FormData();

    try {
        for (const key of allowedKeys) {
            const value = record[key as keyof FishRecord];
            if (!value) continue;

            if (fileFields.includes(key)) {
                let uri = value as string;

                // Cria o objeto file de forma compatível
                const fileObject = await prepareFile(uri, key, record)

                formData.append(key, fileObject as any);
                console.log(`✅ Arquivo adicionado: ${uri}`);
            } else {
                if (record.category === "Embarcada") {
                    formData.append(key, String(value));
                } else {
                    if (key === "species_id") {
                        continue
                    }
                    if (key === "latitude" || key === "longitude") {
                        continue
                    }
                    if (key === "team") {
                        formData.append("code_competidor", String(value));
                    } else {

                        formData.append(key, String(value));
                    }
                }
            }
        }

        return formData;
    } catch (error) {
        console.error('Erro ao criar FormData:', error);
        throw error;
    }
}

export class ApiService {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async get<T>(params?: string): Promise<AxiosResponse> {
        return this.request<T>('GET', params);
    }

    async post<T>(data: any): Promise<AxiosResponse> {
        return this.request<T>('POST', '', data);
    }

    private async request<T>(method: 'GET' | 'POST', params?: string, body?: any): Promise<AxiosResponse> {
        const token = await this.getToken();
        const baseUrl = body?.category === "Embarcada" ? API_BASE_URL_EMBARCADA : API_BASE_URL_BARRANCO;
        const url = `${baseUrl}${this.path}${params ? '/' + params : ''}`;

        try {
            console.log("🟡 Iniciando requisição para:", url);

            const config = {
                headers: {
                    'Authentication': token ? token : '',
                    'Accept': 'application/json',
                },
                timeout: 60000,
                maxBodyLength: Infinity, // Importante para arquivos grandes
                maxContentLength: Infinity,
            };


            if (method === 'GET') {
                return await axios.get(url, config);
            } else {
                const formData = await toFilteredFormData(body);
                console.log("🟡 FormData preparado:", formData);

                return await this.uploadWithRNFetchBlob(url, formData, token || null);
            }

        } catch (error: any) {
            console.log("error: ", error);

            const axiosError = error as AxiosError | any;
            console.error("🔴 Erro detalhado:", {
                message: axiosError.message,
                code: axiosError.code,
                response: axiosError.response?.data,
                request: axiosError.request,
            });

            if (axiosError.response) {
                // Erro do servidor (4xx, 5xx)
                throw new Error(axiosError.response.data?.message || `Erro ${axiosError.response.status}`);
            } else if (axiosError.request) {
                // Requisição foi feita mas não houve resposta
                throw new Error("Sem resposta do servidor. Verifique sua conexão.");
            } else {
                // Erro na configuração da requisição
                throw new Error("Erro ao configurar a requisição.");
            }
        }
    }

    private async uploadWithRNFetchBlob(url: string, formData: any, token?: string | null): Promise<AxiosResponse<any>> {
        try {
            console.log("token:", token);

            const config = {
                "Authentication": token ? token : '',
                "Content-Type": "multipart/form-data",
            };

            console.log(config);
            console.log(url);



            const response = await RNFetchBlob.config({
                timeout: 60000 // 30 segundos
            }).fetch(
                'POST',
                url,
                {
                    Authentication: token ? token : '',
                    otherHeader: "foo",
                    // this is required, otherwise it won't be process as a multipart/form-data request
                    'Content-Type': 'multipart/form-data',

                },
                formData._parts.map(([name, value]: any) => {
                    return typeof value === 'string'
                        ? { name, data: value }
                        : {
                            name,
                            filename: value.name,
                            type: value.type,
                            data: RNFetchBlob.wrap(value.uri.replace('file://', ''))
                        };
                })
            ).uploadProgress((written, total) => {
                console.log("uploaded", written / total);
            });

            console.log("response: ", response);


            if (response.info().status >= 400) {
                throw new Error(`Erro ${response.info().status}: ${await response.text()}`);
            }
            return {
                data: response.json(),
                status: response.info().status,
                headers: response.info().headers,
                config: {}
            } as AxiosResponse<any>;
        } catch (error) {
            console.error('🔴 Upload error:', error);
            throw error;
        }
    }

    private async getToken(): Promise<string | null> {
        try {

            return API_KEY || null;
        } catch (err) {
            console.warn('Erro ao buscar token:', err);
            return null;
        }
    }
}