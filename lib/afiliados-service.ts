import api from "./axios";
import { CatalogoItem, Estado } from "./club-service";

export interface Afiliado {
    id: number;
    Nombre: string;
    Paterno: string;
    Materno: string;
    id_Club: number;
    Fecha_nacimiento: string;
    Curp: string;
    Genero: string;
    id_Escolaridad: number;
    Fecha_afiliacion: string;
    Fecha_baja: string | null;
    Calle: string;
    Exterior: string;
    Interior: string;
    Colonia: string;
    CP: string;
    Ciudad: string;
    Estado: string;
    Telefono_c: string;
    Telefono_cel: string;
    Afiliacion_p: number;
    Afiliacion_s: number;
    id_nivel_tec: number;
    Modalidad: number;
}

export interface AfiliadosCatalogsResponse {
    Catalogo_afiliaciones: CatalogoItem[];
    Niveles_tecnicos: { id: number; Descripcion: string }[];
    Estados: Estado[];
    Escolaridad: CatalogoItem[];
    Afiliados: Afiliado[];
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
