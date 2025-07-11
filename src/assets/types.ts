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

export type FishRecord = {
  species: string;
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


export type LoginData = {
  email: string;
  password: string;
}