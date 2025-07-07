export type RootStackParamList = {
  Login: undefined;
  SearchTeam: undefined;
  RegisterScore: { team: any };
};

export interface Team {
  id: string;
  name: string;
  code: string;
}

export interface FishRecord {
  species: string;
  size: string;
  ticketNumber: string;
  teamMember: string;
  fishPhoto: string;
  ticketPhoto: string;
  releaseVideo: string;
}