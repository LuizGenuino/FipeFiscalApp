import { FishRecord } from "@/src/assets/types";
import { getUser } from "../storage";
import * as FileSystem from 'expo-file-system';
import axios, { AxiosResponse, AxiosError } from 'axios';
import mime from 'mime';
import { Platform } from "react-native";
import RNFetchBlob from 'react-native-blob-util';

const API_BASE_URL_EMBARCADA = "https://42.fipecaceres.com/dev/afericao-embarcada/backend/api/v1";
const API_BASE_URL_BARRANCO = "https://42.fipecaceres.com/dev/afericao-barranco/backend/api/v1";

// Configuração simplificada dos interceptors
axios.interceptors.request.use(config => {
    console.log('🟡 Request:', `${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

axios.interceptors.response.use(response => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
});

async function prepareFile(uri: string, fieldName: string, record: FishRecord) {
    if (!uri) return null;

    if (!uri.startsWith("file://")) {
        uri = `file://${uri}`;
    }

    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
        console.warn(`❌ Arquivo não encontrado: ${uri}`);
        return null;
    }

    const type = mime.getType(uri) || 'application/octet-stream';
    const extension = mime.getExtension(type) || 'file';

    return {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        type,
        name: `${record.team}_${fieldName}_${record.code}.${extension}`,
    };
}

async function toFilteredFormData(record: FishRecord): Promise<FormData> {
    const formData = new FormData();
    const fileFields = ["card_image", "fish_image", "fish_video"];

    // Função auxiliar para adicionar campos
    const appendField = (key: string, value: any) => {
        if (!value) return;

        if (fileFields.includes(key)) {
            prepareFile(value as string, key, record)
                .then(file => file && formData.append(key, file as any))
                .catch(err => console.warn(`⚠️ Erro ao processar ${key}:`, err));
        } else {
            if (record.category !== "Embarcada") {
                if (key === "team") {
                    formData.append("code_competidor", String(value));
                    return;
                }
                if (["species_id", "latitude", "longitude"].includes(key)) return;
            }
            formData.append(key, String(value));
        }
    };

    // Campos principais
    appendField('size', record.size);
    appendField('code', record.code);
    appendField('registered_by', record.registered_by);
    appendField('card_number', record.card_number);
    appendField('team', record.team);

    // Campos de arquivo
    appendField('card_image', record.card_image);
    appendField('fish_image', record.fish_image);
    appendField('fish_video', record.fish_video);

    return formData;
}

export class ApiService {
    constructor(private path: string) { }

    async get<T>(params?: string): Promise<AxiosResponse<T>> {
        return this.request<T>('GET', params);
    }

    async post<T>(data: FishRecord): Promise<AxiosResponse<T>> {
        return this.request<T>('POST', '', data);
    }

    private async request<T>(method: 'GET' | 'POST', params?: string, body?: FishRecord): Promise<AxiosResponse<T>> {
        const token = await this.getToken();
        const baseUrl = body?.category === "Embarcada" ? API_BASE_URL_EMBARCADA : API_BASE_URL_BARRANCO;
        const url = `${baseUrl}${this.path}${params ? `/${params}` : ''}`;

        try {
            const config = {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Accept': 'application/json',
                },
                timeout: 60000
            };

            if (method === 'GET') {
                return await axios.get<T>(url, config);
            } else {
                if (!body) {
                    throw new Error("Request body is required for POST requests.");
                }
                const formData = await toFilteredFormData(body);
                return await this.uploadWithRNFetchBlob<T>(url, formData, token || "");
            }
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private async uploadWithRNFetchBlob<T>(url: string, formData: FormData | null, token?: string): Promise<AxiosResponse<T>> {
        try {
            const response = await RNFetchBlob.fetch(
                'POST',
                url,
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                (formData as any)._parts.map(([name, value]: [string, any]) => ({
                    name,
                    data: typeof value === 'string' ? value : RNFetchBlob.wrap(value.uri.replace('file://', '')),
                    type: value.type,
                    filename: value.name
                }))
            );

            return {
                data: response.json(),
                status: response.info().status,
                headers: response.info().headers,
                config: {}
            } as AxiosResponse<T>;
        } catch (error) {
            console.error('🔴 Upload error:', error);
            throw error;
        }
    }

    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message ||
                error.message ||
                'Erro na requisição';
            throw new Error(message);
        }
        throw new Error(typeof error === 'object' ? (error as any).message : 'Erro desconhecido');
    }

    private async getToken(): Promise<string | null> {
        try {
            const userAuth = await getUser();
            return userAuth ? JSON.parse(userAuth)?.token : null;
        } catch (error) {
            console.warn('⚠️ Erro ao buscar token:', error);
            return null;
        }
    }
}