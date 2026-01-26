import api from "./axios";
import { CatalogoItem, Estado } from "./club-service";
import Cookies from "js-cookie";

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
    Afiliacion_1: number | null;
    Afiliacion_2: number | null;
    Afiliacion_3: number | null;
    Afiliacion_4: number | null;
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

export const getAfiliadosCatalogs = async (id?: number, tipo?: number) => {
    // Manual Token Injection with regex cleanup
    let token = Cookies.get("token") || "";
    token = token.replace(/"/g, '');

    // Construct params object dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {};
    if (id !== undefined) params.id = id;
    if (tipo !== undefined) params.tipo = tipo;

    console.log("DEBUG SERVICE: Fetching with params:", JSON.stringify(params));

    const response = await api.get<AfiliadosCatalogsResponse>("/GetInf_afil", {
        headers: { Authorization: `Bearer ${token}` },
        params: params
    });

    console.log("DEBUG SERVICE: Status:", response.status);
    console.log("DEBUG SERVICE: Typeof data:", typeof response.data);

    // Handle potential text/plain response from backend
    if (typeof response.data === "string") {
        try {
            const parsed = JSON.parse(response.data);
            console.log("DEBUG SERVICE: Parsed successfully. Keys:", Object.keys(parsed));
            if (parsed.Afiliados) console.log("DEBUG SERVICE: Afiliados count:", parsed.Afiliados.length);
            return parsed;
        } catch (e) {
            console.error("DEBUG SERVICE: Failed to parse response data", e);
            return response.data;
        }
    }

    // If it's already an object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataObj = response.data as any;
    console.log("DEBUG SERVICE: Data is object. Keys:", Object.keys(dataObj));
    if (dataObj.Afiliados) {
        console.log("DEBUG SERVICE: Afiliados found in object:", dataObj.Afiliados.length);
    } else {
        console.log("DEBUG SERVICE: 'Afiliados' key MISSING in object!");
    }

    return response.data;
};

export interface CreateAfiliadoPayload {
    nombre: string;
    paterno: string;
    materno: string;
    id_Club: string;
    fecha_nacimiento: string; // YYYY-MM-DD
    curp: string;
    genero: string;
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
    afiliacion_3: string;
    afiliacion_4: string;
    id_nivel_tec: string;
    modalidad: string;
}

export const createAfiliado = async (payload: CreateAfiliadoPayload) => {
    console.log("createAfiliado Payload:", JSON.stringify(payload, null, 2));
    try {
        const response = await api.post("/PostAfiliado", payload);
        console.log("createAfiliado Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("createAfiliado Error:", error);
        throw error;
    }
};

export interface UpdateAfiliadoItem {
    campo: string;
    valor: string;
}

export interface UpdateAfiliadoPayload {
    uno: UpdateAfiliadoItem[];
}

export const updateAfiliado = async (id: number, payload: UpdateAfiliadoPayload) => {
    const response = await api.post("/PutAfiliado", payload, {
        params: { id }
    });
    return response.data;
};
