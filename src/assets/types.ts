
export type FishData = {
    species_id: string;
    photo: any;
    point: number;
    minimumSize?: number;
}

export type FishRecord = {
    code: string;
    team: string;
    registered_by: string;
    species_id: string;
    size: number;
    point: number;
    card_number: string;
    card_image: string;
    fish_image: string;
    fish_video: string;
    latitude?: number;
    longitude?: number;
    synchronized?: boolean;
    created_at?: string;
}

export type ApiResponse = {
    success: boolean;
    status: number;
    message?: string;
    data?: any;
};

export type ControllerResponse = {
    success: boolean;
    message: string;
    data: any;
}



export type LoginData = {
    inspectorName: string;
}


