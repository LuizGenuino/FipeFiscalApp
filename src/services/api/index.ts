
import { FishRecord } from "@/src/assets/types";
import { getUser } from "../storage";

const API_BASE_URL = "https://42.fipecaceres.com/dev/afericao-embarcada/backend/api/v1"
//const API_BASE_URL = 'http://172.32.30.186:3000/api';
//const API_BASE_URL = 'http://192.168.2.170:3000/api';

function toFilteredFormData(record: FishRecord): FormData {
    const allowedKeys = [
      "size",
      "card_image",
      "code",
      "fish_image",
      "registered_by",
      "fish_video",
      "card_number",
      "team",
      "species_id"
    ];
  
    const fileFields = ["card_image", "fish_image", "fish_video"];
    const formData = new FormData();
  
    for (const key of allowedKeys) {
      const value = record[key as keyof FishRecord];
      if (value == null) continue;
  
      if (fileFields.includes(key)) {
        formData.append(key, {
          uri: value as string,
          type: key === "fish_video" ? "video/mp4" : "image/jpeg",
          name: `${key}.${key === "fish_video" ? "mp4" : "jpg"}`
        } as any);
      } else {
        formData.append(key, String(value));
      }
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
    
        const headers: Record<string, string> = {
            'Content-Type': 'multipart/form-data',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    
        const options: RequestInit = {
            method,
            headers: headers,
        };
    
        if (body) {
            options.body = toFilteredFormData(body);
        }
    
        const url = `${API_BASE_URL}${this.path}${params ? '/' + params : ''}`;
    
        try {
            console.log("Requesting URL:", url);

            console.log("tenta fazer um get");
            
            const get = await fetch(url)
            console.log("faz o get", get);

            console.log("get feito com sucesso");
            
            console.log("Options:", options);
    
            const response = await fetch(url, options);
            console.log("Response in request", response);
    
            const data = await response.json();
            console.log("Data in request", data);
    
            if (!response.ok) {
                const message = data?.message || `Erro HTTP: ${response.status}`;
                throw new Error(message);
            }
    
            return data;
        } catch (err: any) {
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