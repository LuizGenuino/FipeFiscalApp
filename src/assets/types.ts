export type RootStackParamList = {
    Login: undefined;
    SearchTeam: undefined;
    RegisterScore: { team_code: string };
};


export type FishData = {
    species: string;
    photo: any;
    point: number;
    minimumSize?: number;
}

export type FishRecord = {
    code: string;
    team: string;
    registered_by: string;
    species: string;
    size: number;
    point: number;
    ticket_number: string;
    card_image: string;
    fish_image: string;
    fish_video: string;
    synchronized?: boolean;
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


