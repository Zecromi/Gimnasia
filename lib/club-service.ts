
import api from "./axios";

export interface Estado {
    id: number;
    Nombre: string;
}

export interface CatalogoItem {
    id: number;
    Nombre: string;
    Descripcion?: string | null;
}

export interface PuestoItem {
    id_puesto: number;
    Nombre: string;
    Descripcion?: string | null;
    Privilegios?: string;
}

export interface ModalidadItem {
    id: number;
    Nombre: string;
    Descripcion?: string;
    Alias?: string;
}

export interface ModalidadDetalleItem {
    id: number;
    Nombre: string;
    Alias: string;
    Nivel: string;
    titulo: string;
    edad_ini: number;
    edad_fin: number;
    id_nivel: number;
}

export interface EventoCatalogoItem {
    id_Evento: number;
    Nombre: string;
}

export interface CatalogsResponse {
    Estados: Estado[];
    Catalogo_afiliaciones: CatalogoItem[];
    Niveles_tecnicos: { id: number; Descripcion: string }[];
    Puestos: PuestoItem[];
    Escolaridad: CatalogoItem[];
    Modalidades: ModalidadItem[];
    View_Modalidades_detalle: ModalidadDetalleItem[];
    Catalogo_eventos: EventoCatalogoItem[];
}

export const getGlobalInfo = async () => {
    const response = await api.get<CatalogsResponse>("/GetInf");
    return response.data;
};

export interface ClubDefinition {
    nombre: string;
    alias: string;
    rfc: string;
    tipo_aparatos_nac: string;
    tipo_aparatos_imp: string;
    tipo_aparatos_fig: string;
    tipo_aparatos_otros: string;
    latitud: string;
    longitud: string;
    asociacion: string;
    email: string;
    web: string;
    id_club_principal: string;
    fundacion: string;
    sector: string;
    tipo_instalaciones: string;
    tel1: string;
    tel2: string;
}

export interface ClubAddress {
    calle: string;
    exterior: string;
    interior: string;
    colonia: string;
    municipio: string;
    id_estado: string;
    cp: string;
    tipo_domicilio: string;
}

export interface SetClubPayload {
    demoClub: ClubDefinition[];
    dirClub1: ClubAddress[];
    dirClub2: ClubAddress[];
}

export const createClub = async (payload: SetClubPayload) => {
    const response = await api.post("/SetClub", payload);
    return response.data;
};

export const mapStateToClubPayload = (data: any): SetClubPayload => {
    const getString = (key: string) => (data[key] as string) || "";
    // Send "1" if true, "0" if false
    const getBoolString = (key: string) => (data[key] ? "1" : "0");

    // Format date from YYYY-MM-DD to DD/MM/YYYY if possible, else return original
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        // Assuming input type="date" returns YYYY-MM-DD
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    const demoClub: ClubDefinition = {
        nombre: getString("nombre"),
        alias: getString("alias"),
        rfc: getString("rfc"),
        tipo_aparatos_nac: getBoolString("nacionales"),
        tipo_aparatos_imp: getBoolString("importados"),
        tipo_aparatos_fig: getBoolString("homologados"),
        tipo_aparatos_otros: getBoolString("otros"),
        latitud: "0",
        longitud: "0",
        asociacion: getString("asociacion"),
        email: getString("email"),
        web: getString("web"),
        id_club_principal: "", // keeping empty string as per prompt requirement
        fundacion: getString("fundacion"),
        sector: data["sector"] === "privado" ? "1" : "0", // 1 privado, 0 publico
        tipo_instalaciones: data["tipoInstalaciones"] === "rentadas" ? "1" : "0", // 1 rentada, 0 propia             
        tel1: getString("telPrincipal"),
        tel2: getString("telSecundario"),
    };

    const dirClub1: ClubAddress = {
        calle: getString("calle"),
        exterior: getString("numExt"),
        interior: getString("numInt"),
        colonia: getString("colonia"),
        municipio: getString("municipio"),
        id_estado: getString("estado"),
        cp: getString("cp"),
        tipo_domicilio: "Postal", // Fixed value
    };

    const isIgual = !!data["igualDomicilio"];

    const dirClub2: ClubAddress = isIgual
        ? {
            ...dirClub1,
            tipo_domicilio: "Fiscal", // Fixed value
        }
        : {
            calle: getString("calleFiscal"),
            exterior: getString("numExtFiscal"),
            interior: getString("numIntFiscal"),
            colonia: getString("coloniaFiscal"),
            municipio: getString("municipioFiscal"),
            id_estado: getString("estadoFiscal"),
            cp: getString("cp"),
            tipo_domicilio: "Fiscal", // Fixed value
        };

    return {
        demoClub: [demoClub],
        dirClub1: [dirClub1],
        dirClub2: [dirClub2],
    };
};

export interface ViewClubGral {
    Club: string
    Alias: string
    Email: string
    Asociacion: string
    membresia: boolean
    Estatus: boolean
    Web: string
    id: number
    rfc: string
    Tipo_aparatos_nac: boolean
    Tipo_aparatos_imp: boolean
    Tipos_aparatos_fig: boolean
    Tipos_aparatos_otros: boolean
    id_club_principal: number
    Fundacion: string
    Sector: boolean
    Tipo_instalaciones: boolean
    Telefono1: string
    Telefono2: string
    usuario?: string
    password?: string
}

export interface GetClubesResponse {
    View_Club_gral: ViewClubGral[];
}

export const getClubs = async () => {
    const response = await api.get<GetClubesResponse>("/GetClubes");
    return response.data;
};



export interface ClubDetail {
    id: number
    Nombre: string
    Alias: string
    rfc: string
    Tipo_aparatos_nac: boolean
    Tipo_aparatos_imp: boolean
    Tipos_aparatos_fig: boolean
    Tipos_aparatos_otros: boolean
    Latitud: number
    longitud: number
    Asociacion: string
    Email: string
    Web: string
    id_club_principal: number
    membresia: boolean
    Estatus: boolean
    Fundacion: string
    Sector: boolean
    Tipo_instalaciones: boolean
    Telefono1: string
    Telefono2: string
}

export interface AddressDetail {
    id: number
    id_club: number
    Calle: string
    Exterior: string
    Interior: string
    Colonia: string
    cp: string
    Tipo_domicilio: string
    id_estado: number
}

export interface GetClubDetailResponse {
    Clubs: ClubDetail[]
    DireccionPostal: AddressDetail[]
    DireccionFiscal: AddressDetail[]
}

export const getClubDetail = async (id: number) => {
    const response = await api.get<GetClubDetailResponse>(`/GetClubesDetalle?id=${id}`);
    console.log(response.data);
    return response.data;
};

export const updateClub = async (id: number, payload: SetClubPayload) => {
    console.log("enviando datos para actualizar club", payload);
    const response = await api.post(`/PostClub/${id}`, payload);
    return response.data;
};




