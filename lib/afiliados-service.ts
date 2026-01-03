import api from "./axios";
import { CatalogoItem, Estado } from "./club-service";

export interface AfiliadosCatalogsResponse {
    Catalogo_afiliaciones: CatalogoItem[];
    Niveles_tecnicos: { id: number; Descripcion: string }[];
    Estados: Estado[];
    Escolaridad: CatalogoItem[];
}

export const getAfiliadosCatalogs = async () => {
    const response = await api.get<AfiliadosCatalogsResponse>("/GetInf_afil");
    return response.data;
};

export interface CreateAfiliadoPayload {
    nombre: string;
    paterno: string;
    materno: string;
    id_Club: string;
    fecha_nacimiento: string; // YYYY-MM-DD
    curp: string;
    genero: string; // "femenino" | "masculino" -> Check API expectation, usually 0/1 or F/M or string
    escolaridad: string;
    calle: string;
    exterior: string;
    interior: string;
    colonia: string;
    cp: string;
    ciudad: string;
    estado: string;
    telefono_c: string;
    telefono_cel: string;
    afiliacion_p: string;
    afiliacion_s: string;
    id_nivel_tec: string;
    modalidad: string;
}

export const createAfiliado = async (payload: CreateAfiliadoPayload) => {
    const response = await api.post("/PostAfiliado", payload);
    return response.data;
};
