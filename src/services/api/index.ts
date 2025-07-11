//const url = 'http://192.168.2.141:3000/api'; 
const url = 'http://192.168.2.170:3000/api';

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
            },
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(String(response.status));
        }
        return response.json();
    }

    async post<T>(data: any): Promise<T> {
        const response = await fetch(`${url}${this.path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log(response);

        if (!response.ok) {
            throw new Error(String(response.status));
        }
        return response.json();
    }
}