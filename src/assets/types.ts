export type RootStackParamList = {
    Login: undefined;
    SearchTeam: undefined;
    RegisterScore: { team: any };
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
    id: number;
    species: string;
    photo: string;
    point: number;
}

export type FishRecord = {
    species: number | null;
    size: string;
    ticketNumber: string;
    teamMember: string;
    fishPhoto: string;
    ticketPhoto: string;
    releaseVideo: string;
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
    email: string;
    password: string;
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
