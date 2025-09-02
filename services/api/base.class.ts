import { FishRecord } from "@/assets/types";
import * as FileSystem from 'expo-file-system';
import axios, { AxiosResponse, AxiosError } from 'axios';
import mime from 'mime';
import { Platform } from "react-native";
import RNFetchBlob from 'react-native-blob-util';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY || "8Hl5vPkL@9qF!zX3mN*7RtS&Y"

export abstract class APIBase {
    private baseUrl: string = ''
    private path: string = ''

    constructor(base: string) {
        this.baseUrl = base
    }

    public async enviarDados(record: FishRecord): Promise<AxiosResponse> {

        this.path = "fish_catch/no-media/"

        const formData = this.formatRequestBody(record)

        return await this.request('POST', formData)
    }

    public async enviarMidias(path: string, record: FishRecord): Promise<AxiosResponse> {

        this.path = path

        const formData = new FormData()

        const formDataKeys = ["card_image", "fish_image", "fish_video"]

        for (const key of formDataKeys) {
            let uri = record[key as keyof FishRecord];
            const fileObject = await this.prepareFile(uri as string, key, record)
            formData.append(key, fileObject as any);
        }

        return await this.requestMedia('POST', formData)
    }

    protected abstract formatRequestBody(record: FishRecord): FormData | object

    private async request(method: 'POST' | 'GET', body?: FormData | object): Promise<AxiosResponse> {
        try {
            const token = await this.getToken();
            console.log('token:', token);

            const url = `${this.baseUrl}/${this.path}`;
            console.log('url:', url);
            const config = {
                headers: {
                    // 'Authentication': token ? token : '',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 60000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            };
            console.log('config:', config);
            if (method === 'GET') {
                const response = await axios.get(url, config);
                console.log('response:', response);
                return response
            }
            if (method === 'POST' && typeof body === 'object') {
                console.log('body:', body);
                const response = await axios.post(url, body, config)
                console.log('response:', response);
                return response

            } else {
                throw new Error('Erro na montagem da requisição')
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

    private async requestMedia(method: 'POST' | 'GET', formData?: FormData | null): Promise<AxiosResponse> {
        try {
            const token = await this.getToken();
            console.log("token: ", token);
            const url = `${this.baseUrl}/${this.path}`;
            console.log("url: ", url);

            if (method === 'POST' && formData) {
                console.log("formData: ", formData);
                const response = await RNFetchBlob.config({
                    timeout: 60000 // 30 segundos
                }).fetch(
                    'POST',
                    url,
                    {
                        Authentication: token ? token : '',
                        otherHeader: "foo",
                        'Content-Type': 'multipart/form-data',

                    },
                    formData)
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
            } else {
                throw new Error('Erro na montagem da requisição')
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

    private async prepareFile(uri: string, fieldName: string, record: FishRecord): Promise<{ uri: string, type: string, name: string } | null> {
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

    private async getToken(): Promise<string | null> {
        try {
            return API_KEY || null;
        } catch (err) {
            console.warn('Erro ao buscar token:', err);
            return null;
        }
    }
}