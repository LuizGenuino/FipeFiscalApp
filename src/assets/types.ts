export type RootStackParamList = {
    Login: undefined;
    SearchTeam: undefined;
    RegisterScore: { team_code: string };
};

export type Team = {
    id: string;
    name: string;
    code: string;
}

export type Members = {
    id: string;
    name: string;
}

export type FishData = {
    species: string;
    photo: any;
    point: number;
    minimumSize?: number;
}

export type FishRecord = {
    code: string | null | undefined;
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

export type TeamsOfflineStorage = {
    id: string;
    code: string;
    team_name: string;
    id_member_1: number;
    name_member_1: string;
    id_member_2?: number;
    name_member_2?: string;
    id_member_3?: number;
    name_member_3?: string;
    id_member_4?: number;
    name_member_4?: string;
}

export type OfflineStorageData = {
    column: string;
    value: TeamsOfflineStorage[] | FishData[] | any[];
}
