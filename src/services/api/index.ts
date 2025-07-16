
import { getUser } from "../storage";

const API_BASE_URL = 'http://192.168.2.141:3000/api';
//const API_BASE_URL = 'http://192.168.2.170:3000/api';


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

    private async request<T>(method: 'GET' | 'POST', params?: string | '', body?: any): Promise<T> {
        const token = await this.getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            console.log(`url request: ${API_BASE_URL}${this.path}${params && '/'+params || ''}`);
            
            const response = await fetch(`${API_BASE_URL}${this.path}${params && '/'+params || ''}`, options);
            const data = await response.json();

            if (!response.ok) {
                const message = data?.message || `Erro HTTP: ${response.status}`;
                throw new Error(message);
            }

            return data;
        } catch (err: any) {
            // Aqui você pode logar o erro em um serviço, se quiser
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