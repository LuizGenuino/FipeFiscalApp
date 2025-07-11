import { ApiResponse, LoginData } from "@/src/assets/types";
import { ApiService } from "../api";
import { getUser, storeUser } from "../storage";

export async function LoginService(data: LoginData): Promise<ApiResponse> {
    try {
        const apiService = new ApiService('/login')

        const response: ApiResponse = await apiService.post(data);

        console.log('Login response:', response);
        await storeUser(response?.data);

        return {
            success: true,
            status: 200,
            message: "Login Realizado com Sucesso!",
            data: response?.data,
        }
    } catch (error: any) {
        
        return {
            success: false,
            status: error,
            message: "Falha na autenticação"
        }

    }
}