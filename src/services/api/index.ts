
import { FishRecord } from "@/src/assets/types";
import { getUser } from "../storage";
import * as FileSystem from 'expo-file-system';

const API_BASE_URL = "https://42.fipecaceres.com/dev/afericao-embarcada/backend/api/v1"
//const API_BASE_URL = 'http://172.32.30.186:3000/api';
//const API_BASE_URL = 'http://192.168.2.170:3000/api';


function fetchWithTimeout(resource: RequestInfo, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => {
            console.warn("⏰ Requisição abortada por timeout");
            controller.abort();
        }, timeout);

        const fetchOptions = { ...options, signal: controller.signal };

        return fetch(resource, fetchOptions)
            .finally(() => clearTimeout(id));
    } catch (error) {
        console.error("erro timeout", error);
        return Promise.reject()
    }
}




async function toFilteredFormData(record: FishRecord): Promise<FormData> {
    const allowedKeys = [
        "size", "card_image", "code", "fish_image",
        "registered_by", "fish_video", "card_number", "team", "species_id"
    ];

    const fileFields = ["card_image", "fish_image", "fish_video"];
    const formData = new FormData();

    for (const key of allowedKeys) {
        const value = record[key as keyof FishRecord];
        if (!value) continue;

        if (fileFields.includes(key)) {
            let uri = value as string;

            // Verifica se é uma URI válida
            if (!uri.startsWith("file://")) {
                uri = `file://${uri}`;
            }

            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                console.warn(`❌ Arquivo não encontrado: ${uri}`);
                continue;
            }

            const type = key === "fish_video" ? "video/quicktime" : "image/jpeg";
            const extension = key === "fish_video" ? "mov" : "jpg";

            formData.append(key, {
                file: {
                    uri,
                    type,
                    name: `${record.team}_${key}_${record.code}.${extension}`,
                }
            } as any);

            console.log(`✅ Arquivo adicionado: ${uri}`);
        } else {
            formData.append(key, String(value));
        }
    }

    for (const pair of formData as any) {
        console.log(pair[0], pair[1]);
    }

    return formData;
}





export class ApiService {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async get<T>(params?: string): Promise<T> {
        return this.request<T>('GET', params);
    }

    async post<T>(data: any): Promise<T> {
        return this.request<T>('POST', '', data);
    }

    private async request<T>(method: 'GET' | 'POST', params?: string, body?: any): Promise<T> {
        const token = await this.getToken();

        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = await toFilteredFormData(body);
        }

        const url = `${API_BASE_URL}${this.path}${params ? '/' + params : ''}`;

        try {
            console.log("🟡 URL:", url);
            console.log("🟡 Options:", JSON.stringify(options, null, 2));

            const response = await fetchWithTimeout(url, options, 15000);
            console.log("Response status:", response.status);

            const contentType = response.headers.get("content-type");
            let data: any;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
                console.warn("⚠️ Resposta não é JSON. Conteúdo bruto:", data);
            }

            console.log("Data in request", data);

            if (!response.ok) {
                const message = data?.message || `Erro HTTP: ${response.status}`;
                throw new Error(message);
            }

            return data;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.error("Erro: tempo limite da requisição excedido.");
                throw new Error('Tempo limite da requisição excedido');
            }

            console.error("Erro request:", err);
            throw new Error(err?.message || 'Erro ao conectar com o servidor');
        }
    }


    private async getToken(): Promise<string | null> {
        try {
            const userAuth = await getUser();
            if (!userAuth) return null;

            const user = JSON.parse(userAuth);
            return user?.token || null;
        } catch (err) {
            console.warn('Erro ao buscar token:', err);
            return null;
        }
    }
}