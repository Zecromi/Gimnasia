import api from "./axios";

export interface EventoItem {
    id_evento: string;
    organizador: string;
    asociacion: string;
    nombre: string;
    lugar: string;
    sede: string;
    region: string;
    limite_participantes: string;
    f_ini_evento: string;
    f_fin_evento: string;
    f_ini_incripciones: string;
    f_fin_incripciones: string;
    hora_limite_inscripciones: string;
}

export interface ConfiguracionItem {
    id_modalidad: string;
    costo_base: string;
    costo_grupo: string;
    es_grupo: string;
}

export interface NivelItem {
    id_modalidad: string;
    id_nivel: string;
    costo: string;
}

export interface AdicionalItem {
    descripcion: string;
    costo_base: string;
}

export interface SetEventoPayload {
    evento: EventoItem[];
    configuracion: ConfiguracionItem[];
    niveles: NivelItem[];
    adicionales: AdicionalItem[];
}

export const createEvento = async (payload: SetEventoPayload) => {
    console.log(payload)
    const response = await api.post("/SetEvento", payload);
    return response.data;
};
