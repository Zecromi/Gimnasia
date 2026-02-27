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
    id_categoria: string;
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
    //return true;
};

export interface EventoResponseItem {
    id: number;
    id_Evento: number;
    Organizador: string;
    Asociacion: string;
    Nombre: string;
    Lugar: string;
    Sede: string;
    Region: string;
    Limite_participantes: number;
    F_ini_evento: string;
    F_fin_evento: string;
    F_ini_incripciones: string;
    F_fin_incripciones: string;
    Hora_limite_inscripciones: string;
    Status: string;
    Restriccion: string;

}
export interface EventosConfiguradosItem {
    id: number;
    id_Evento: number;
    Modalidad: string;
    Organizador: string;
    Asociacion: string;
    Nombre: string;
    Lugar: string;
    Sede: string;
    Region: string;
    Limite_participantes: number | string;
    F_ini_evento: string;
    F_fin_evento: string;
    F_ini_incripciones: string;
    F_fin_incripciones: string;
    Hora_limite_inscripciones: string;
    Status: string;
    Restriccion: string;
    Costo_base: string;
    Costo_grupo: string;
    es_grupo: string;
}

export interface GetEventosResponse {
    Eventos: EventoResponseItem[];
    Eventos_configurados: EventosConfiguradosItem[];
}

export const getEventos = async () => {
    const response = await api.get<GetEventosResponse>("/GetEvent");
    return response.data;
};

export const putEventos = async (id_evento: string, body: any) => {
    console.log(id_evento)
    console.log(body)
    const response = await api.post("/PutEvento", body, {
        params: {
            id: id_evento,
        },
    });
    return response.data;
};

export const putEventosNiveles = async (body: any) => {
    console.log(body)
    const response = await api.post("/PutNiveles_insc_act", body);
    return response.data;
    //return true;
};

export const postBlock = async (User: string, tipo: string) => {
    console.log(User, tipo)
    const response = await api.post("/PostBlock", null, {
        params: {
            User,
            tipo,
        },
    });
    console.log(response.data)
    return response.data;
};



export interface AfiliadoItem {
    id_afiliado: number;
    Nombre: string;
    Paterno: string;
    Materno: string;
    id: number;
    id_nivel: number;
    id_categoria: number;
}

export interface AfiliadosEventosResponse {
    Afiliados_base: AfiliadoItem[];
}

export const getAfiliadosEventos = async (id_Club: string) => {
    const response = await api.get<AfiliadosEventosResponse>("/GetAfiliados_base", {
        params: {
            id_Club,
        },
    });
    return response.data;
};
//PutDelinscripcion

export const postInscripcion = async (body: any) => {
    console.log(body)
    const response = await api.post("/SetInscripcion", body)
    return response.data;
    //return false;
};


export interface AdicionalEventoItem {
    id_aparato: number;
    Descripcion: string;
    Costo: number;
}

export interface GetAdicionalesResponse {
    Adicionales: AdicionalEventoItem[];
}

export interface NivelConfiguradoItem {
    id_evento: number;
    id_modalidad: number;
    id_nivel: number;
    id_categoria: number;
    costo: number | string;
}

export interface GetNivelesResponse {
    Niveles: NivelConfiguradoItem[];
}

export const getAdicionales = async (id: string): Promise<GetAdicionalesResponse> => {
    console.log(id)
    const response = await api.get<GetAdicionalesResponse>(`/GetEventAdd`, {
        params: {
            evento: id
        }
    });
    console.log(response.data);
    return response.data;
};

export const getNiveles = async (id: string): Promise<GetNivelesResponse> => {
    console.log(id)
    const response = await api.get<GetNivelesResponse>(`/GetEventNiveles`, {
        params: {
            evento: id
        }
    });
    console.log(response.data);
    return response.data;
};

export interface InscripcionesReportParams {
    id_evento?: string;
    nombre_event?: string;
    club?: string;
    id_afiliado?: string;
    nom_afiliado?: string;
    status?: string;
}

export interface InscripcionReportItem {
    id_evento: number;
    evento: string;
    club: string;
    id_afiliado: number;
    afiliado: string;
    Curp: string;
    Fecha_nacimiento: string;
    Edades: string;
    Nivel: string;
    Sub_División: string;
    Costo_ind: number;
    Concepto: string;
    Asociación: string;
}

export interface GetInscripcionesReportResponse {
    resultados: InscripcionReportItem[];
}

export const getInscripcionesReport = async (params: InscripcionesReportParams) => {
    console.log("getInscripcionesReport params:", params);
    const response = await api.get<GetInscripcionesReportResponse>("/GetRepo_inscripciones", { params });
    return response.data;
};


export const delInscripcion = async (id_evento: string, id_afiliado: string) => {
    console.log(id_evento)
    console.log(id_afiliado)
    const response = await api.get("/PutDelInscripcion", {
        params: {
            id_afiliado: id_afiliado,
            id_evento: id_evento,

        },
    });
    return response.data;
};
