import { FishRecord } from "@/assets/types";
import { APIBase } from "./base.class";

const API_BASE_URL_EMBARCADA = process.env.EXPO_PUBLIC_API_URL_EMBARCADA || "https://42.fipecaceres.com/dev/afericao-embarcada/backend/api/v1";
const API_BASE_URL_BARRANCO = process.env.EXPO_PUBLIC_API_URL_BARRANCO || "https://42.fipecaceres.com/dev/afericao-barranco/backend/api/v1";
class BarrancoAPIService extends APIBase {
    constructor() {
        super(API_BASE_URL_BARRANCO)
    }

    protected formatRequestBody(record: FishRecord): object {
        const formDataKeys = ["code", "card_number", "registered_by", "size", "team"] as const // com o 'as const' eu defino o meu array com esse itens especificos e nao um array com string qualquer
        type FormDataKeys = typeof formDataKeys[number]; // ao usar o [number] eu pego a união do array, ou seja, 'code' | 'card_number' | ....
        const data: Partial<Record<FormDataKeys, any>> = {}; //crio um objeto do tipo Record mas com as chaves do FormDataKeys e valores any <chave, valor>
        formDataKeys.forEach((key) => {
            data[key] = record[key];
        });

        return data
    }
}

class EmbarcadaAPIService extends APIBase {
    constructor() {
        super(API_BASE_URL_EMBARCADA)
    }

    protected formatRequestBody(record: FishRecord): object {
        const formDataKeys = ["code", "card_number", "team", "size", "registered_by", "species_id", "latitude", "longitude"] as const
        type FormDataKeys = typeof formDataKeys[number];
        const data: Partial<Record<FormDataKeys, any>> = {}; //crio um objeto do tipo Record mas com as chaves do FormDataKeys e valores any <chave, valor>
        formDataKeys.forEach((key) => {
            if (key === 'latitude' || key === 'longitude') {
                data[key] = record[key]?.toString()
            } else {
                data[key] = record[key];
            }
        });

        return data
    }
}

export const ApiService = {
    barranco: new BarrancoAPIService(),
    embarcada: new EmbarcadaAPIService()
}