import { FishRecord } from "@/assets/types";
import { APIBase } from "./base.class";

const API_BASE_URL_EMBARCADA = process.env.EXPO_PUBLIC_API_URL_EMBARCADA || "https://42.fipecaceres.com/dev/afericao-embarcada/backend/api/v1";
const API_BASE_URL_BARRANCO = process.env.EXPO_PUBLIC_API_URL_BARRANCO || "https://42.fipecaceres.com/dev/afericao-barranco/backend/api/v1";
class BarrancoAPIService extends APIBase {
    constructor() {
        super(API_BASE_URL_BARRANCO)
    }

    protected formDataRequest(record: FishRecord): FormData {
        const formDataKeys = ["size", "code", "registered_by", "card_number", "team"]
        const formData = new FormData()
        formDataKeys.forEach((key: String) => {
            formData.append(key === 'team' ? "code_competidor" : key as string, String(record[key as keyof FishRecord]))
        })

        return formData
    }
}

class EmbarcadaAPIService extends APIBase {
    constructor() {
        super(API_BASE_URL_EMBARCADA)
    }

    protected formDataRequest(record: FishRecord): FormData {
        const formDataKeys = ["size", "code", "latitude", "longitude", "registered_by", "card_number", "team", "species_id"]
        const formData = new FormData()
        formDataKeys.forEach((key: String) => {
            formData.append(key as string, String(record[key as keyof FishRecord]))
        })

        return formData
    }
}

export const ApiService = {
    barranco: new BarrancoAPIService(),
    embarcada: new EmbarcadaAPIService()
}