import { getUser } from "../storage";

const url = 'http://192.168.2.141:3000/api';
//const url = 'http://192.168.2.170:3000/api';

export class ApiService {
    path = '';

    constructor(path: string) {
        this.path = path;
    }

    async get<T>(): Promise<T> {
        const response = await fetch(`${url}${this.path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Adiciona o token de autenticação se disponível
                ...(await this.getToken() ? { Authorization: `${await this.getToken()}` } : {}),
            },

        });

        const responseData = await response.json();

        if (!response.ok) {
            // Tenta pegar a mensagem do erro no corpo da resposta
            const errorMessage = responseData?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return responseData;
    }

    async post<T>(data: any): Promise<T> {
        const response = await fetch(`${url}${this.path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Tenta pegar a mensagem do erro no corpo da resposta
            const errorMessage = responseData?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return responseData;
    }

    async getToken(): Promise<string> {
        const userAuth: any = await getUser();
        const user = JSON.parse(userAuth);

        if (!user || !user.token) {
            throw new Error('Usuário não autenticado ou token não encontrado');
        }

        return user.token;
    }
}