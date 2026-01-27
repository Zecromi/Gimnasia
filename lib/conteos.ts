import api from "./axios";

export interface ConteoItem {
    conteo: number;
    descripcion?: string;
    Descripcion?: string; // Handling API casing inconsistency
}

export interface GetConteosResponse {
    Conteos_club: ConteoItem[];
    Table1: ConteoItem[];
}

export const getConteos = async () => {
    const response = await api.get<GetConteosResponse>("/GetConteos");
    return response.data;
};
