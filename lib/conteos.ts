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

export interface ConteoAfiliadoItem {
    conteo: number;
    id_club: number;
    estatus: string;
}

export interface ConteoInscritoItem {
    conteo: number;
    id_Club: number;
}

export interface GetConteosAfilResponse {
    Conteos_afiliados: ConteoAfiliadoItem[];
    Conteos_inscritos: ConteoInscritoItem[];
}

export const getConteosAfil = async (clubId: string) => {
    const response = await api.get<GetConteosAfilResponse>("/GetConteos_afil", {
        params: { club: clubId }
    });
    return response.data;
};
